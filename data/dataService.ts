
import { supabase } from '../lib/supabaseClient';
import { User, Student, StudentProfileData, TartiliRecord, HafalanRecord, JuzTarget, SurahTarget, HafalanStatus, TeacherProfile, MurojaahRecord, DailyNote, Reminder, ReportStudentData, ReportProgress, WeeklySchedule, ScheduleEntry } from '../types';
import { JUZ_29_SURAHS, JUZ_30_SURAHS, TARTILI_LEVELS } from '../constants';

const BUCKET_NAME = 'app_assets';

// --- AUTHENTICATION ---
export const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
};

export const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

// FIX: Add missing registerUser function.
export const registerUser = async (email: string, password: string): Promise<{ success: boolean; message: string; }> => {
    const { error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        return { success: false, message: error.message };
    }
    return { success: true, message: 'Registrasi berhasil! Silakan periksa email Anda untuk konfirmasi.' };
};

const getCurrentUserId = async (): Promise<string | null> => {
    const session = await getSession();
    return session?.user?.id || null;
};


// --- CLASSES & STUDENTS ---
export const getClasses = async (): Promise<string[]> => {
    const { data, error } = await supabase.from('students').select('class');
    if (error) {
        console.error("Error fetching classes:", error);
        return [];
    }
    // FIX: Explicitly type the map parameter `s` to ensure TypeScript correctly infers the result as `string[]`, resolving the `unknown[]` error.
    const uniqueClasses = [...new Set((data || []).map((s: { class: string }) => s.class))];
    return uniqueClasses.sort();
};

export const getStudents = async (className?: string): Promise<Student[]> => {
    let query = supabase.from('students').select('*');
    if (className) {
        query = query.eq('class', className);
    }
    const { data, error } = await query.order('name');
    if (error) {
        console.error("Error fetching students:", error);
        return [];
    }
    return data;
};

export const getStudentProfileById = async (id: number): Promise<StudentProfileData | null> => {
    // This function now needs to aggregate data from multiple tables
    const { data: student, error: studentError } = await supabase.from('students').select('*').eq('id', id).single();
    if (studentError || !student) {
        console.error("Error fetching student profile:", studentError);
        return null;
    }

    const [
        { data: tartiliHistory },
        { data: hafalanHistory },
        { data: murojaahHistory },
        { data: hafalanTargetsRaw }
    ] = await Promise.all([
        supabase.from('tartili_history').select('*').eq('student_id', id).order('date', { ascending: false }),
        supabase.from('hafalan_history').select('*').eq('student_id', id).order('date', { ascending: false }),
        supabase.from('murojaah_history').select('*').eq('student_id', id).order('date', { ascending: false }),
        supabase.from('hafalan_targets').select('*').eq('student_id', id)
    ]);

    const processChartData = (records: {date: string, score: number}[]) => 
        (records || []).map(r => ({ name: new Date(r.date + 'T00:00:00').toLocaleString('default', { month: 'short' }), score: r.score }));

    const getSurahStatus = (s: { memorized_ayat: number, total_ayat: number }): HafalanStatus => {
        if (s.memorized_ayat >= s.total_ayat) return 'Selesai';
        if (s.memorized_ayat > 0) return 'Sedang Proses';
        return 'Belum Dimulai';
    }
    
    const hafalanTargets: JuzTarget[] = (hafalanTargetsRaw || []).reduce((acc: JuzTarget[], target) => {
        let juzGroup = acc.find(j => j.juz === target.juz);
        if (!juzGroup) {
            juzGroup = { juz: target.juz, surahs: [] };
            acc.push(juzGroup);
        }
        juzGroup.surahs.push({
            name: target.surah_name,
            totalAyat: target.total_ayat,
            memorizedAyat: target.memorized_ayat,
            status: getSurahStatus(target)
        });
        return acc;
    }, []);

    return {
        id: student.id,
        name: student.name,
        class: student.class,
        joinDate: student.join_date,
        profilePic: student.profile_pic_url,
        currentTartiliLevel: student.current_tartili_level,
        tartiliHistory: tartiliHistory || [],
        hafalanHistory: hafalanHistory || [],
        murojaahHistory: murojaahHistory || [],
        tartiliChartData: processChartData(tartiliHistory || []),
        hafalanChartData: processChartData(hafalanHistory || []),
        murojaahChartData: processChartData(murojaahHistory || []),
        hafalanTargets,
    };
};

export const getAllProfiles = async (): Promise<StudentProfileData[]> => {
    const { data: students, error } = await supabase.from('students').select('*').order('name');
    if (error) {
        console.error("Error fetching all students for profiles:", error);
        return [];
    }
    const profiles = await Promise.all(students.map(s => getStudentProfileById(s.id)));
    return profiles.filter((p): p is StudentProfileData => p !== null);
};

export const addStudent = async (name: string, className: string) => {
    const { data, error } = await supabase.from('students').insert({ 
        name, 
        class: className.toUpperCase().trim(),
        join_date: new Date().toISOString().split('T')[0],
        current_tartili_level: TARTILI_LEVELS[0]
    }).select().single();

    if (error) {
        console.error("Error adding student:", error);
        return null;
    }
    
    const targetsToInsert = [
        ...JUZ_30_SURAHS.map(s => ({ student_id: data.id, juz: 30, surah_name: s.name, total_ayat: s.totalAyat, memorized_ayat: 0})),
        ...JUZ_29_SURAHS.map(s => ({ student_id: data.id, juz: 29, surah_name: s.name, total_ayat: s.totalAyat, memorized_ayat: 0}))
    ];
    await supabase.from('hafalan_targets').insert(targetsToInsert);

    return data;
};

export const deleteStudent = async (studentId: number) => {
    const { error } = await supabase.from('students').delete().eq('id', studentId);
    if (error) console.error("Error deleting student:", error);
};

export const updateStudentProfile = async (id: number, updatedData: Partial<StudentProfileData>) => {
    const studentUpdate: Partial<Student> & { profile_pic_url?: string | null, join_date?: string } = {};
    if (updatedData.name) studentUpdate.name = updatedData.name;
    if (updatedData.profilePic) studentUpdate.profile_pic_url = updatedData.profilePic;
    if (updatedData.joinDate) studentUpdate.join_date = updatedData.joinDate;
    
    const { error } = await supabase.from('students').update(studentUpdate).eq('id', id);
    if (error) console.error("Error updating student profile:", error);
};

// --- RECORD MANAGEMENT ---
export const addTartiliRecord = async (studentId: number, record: TartiliRecord) => {
    await supabase.from('tartili_history').insert({ student_id: studentId, ...record });
    await supabase.from('students').update({ current_tartili_level: record.level }).eq('id', studentId);
};

export const deleteLastTartiliRecord = async (studentId: number) => {
    const { data: lastRecord } = await supabase.from('tartili_history').select('id').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1).single();
    if (lastRecord) {
        await supabase.from('tartili_history').delete().eq('id', lastRecord.id);
    }
};

export const graduateStudentTartili = async (studentId: number, passedLevel: string, score: number, notes: string, date: string) => {
    const drillRecord = {
        date,
        level: passedLevel,
        page: 'Ujian',
        score,
        notes: `LULUS UJIAN DRILL - ${passedLevel}. ${notes || ''}`.trim(),
    };
    await addTartiliRecord(studentId, drillRecord);
    
    const currentLevelIndex = TARTILI_LEVELS.indexOf(passedLevel);
    let newLevel = "Lulus Tartili";
    if (currentLevelIndex > -1 && currentLevelIndex < TARTILI_LEVELS.length - 1) {
        newLevel = TARTILI_LEVELS[currentLevelIndex + 1];
    }
    await supabase.from('students').update({ current_tartili_level: newLevel }).eq('id', studentId);
};

const recalculateSurahTarget = async (studentId: number, surahName: string) => {
    const { data: surahTarget, error: targetError } = await supabase.from('hafalan_targets').select('id, total_ayat').eq('student_id', studentId).eq('surah_name', surahName).single();
    if (targetError || !surahTarget) return;

    const { data: relevantHistory, error: historyError } = await supabase.from('hafalan_history').select('ayat').eq('student_id', studentId).eq('surah', surahName);
    if (historyError) return;

    let totalMemorized = 0;
    const memorizedAyats = new Set<number>();
    for (const record of relevantHistory) {
        const [start, end] = record.ayat.split('-').map(Number);
        const endAyat = end || start;
        for (let i = start; i <= endAyat; i++) {
            memorizedAyats.add(i);
        }
    }
    totalMemorized = memorizedAyats.size;

    await supabase.from('hafalan_targets').update({ memorized_ayat: totalMemorized }).eq('id', surahTarget.id);
};

export const addHafalanRecord = async (studentId: number, record: HafalanRecord) => {
    await supabase.from('hafalan_history').insert({ student_id: studentId, ...record });
    await recalculateSurahTarget(studentId, record.surah);
};

export const deleteLastHafalanRecord = async (studentId: number) => {
    const { data: lastRecord } = await supabase.from('hafalan_history').select('id, surah').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1).single();
    if (lastRecord) {
        await supabase.from('hafalan_history').delete().eq('id', lastRecord.id);
        await recalculateSurahTarget(studentId, lastRecord.surah);
    }
};

export const addMurojaahRecord = async (studentId: number, record: MurojaahRecord) => {
    await supabase.from('murojaah_history').insert({ student_id: studentId, ...record });
};

export const deleteLastMurojaahRecord = async (studentId: number) => {
    const { data: lastRecord } = await supabase.from('murojaah_history').select('id').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1).single();
    if (lastRecord) {
        await supabase.from('murojaah_history').delete().eq('id', lastRecord.id);
    }
};

// --- DASHBOARD DATA ---
export const getRecentMemorizations = async () => {
    const { data, error } = await supabase
        .from('hafalan_history')
        .select('student_id, surah, date, students(name), hafalan_targets(total_ayat, memorized_ayat, surah_name)')
        .order('date', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error getting recent memorizations:", error);
        return [];
    }

    const uniqueStudents = Array.from(new Set(data.map(item => item.student_id)))
        .map(id => data.find(item => item.student_id === id))
        .slice(0, 6);

    return uniqueStudents.map(item => {
        if (!item || !item.students || !item.hafalan_targets) return null;
        const target = (item.hafalan_targets as any[]).find(t => t.surah_name === item.surah);
        const progress = target ? (target.memorized_ayat / target.total_ayat) * 100 : 0;
        return {
            studentId: item.student_id,
            student: item.students.name,
            surah: item.surah,
            progress: progress,
        };
    }).filter(Boolean);
};


export const getOverallProgress = async (): Promise<number> => {
    const { data, error } = await supabase.from('hafalan_targets').select('total_ayat, memorized_ayat');
    if (error) {
        console.error("Error getting overall progress:", error);
        return 0;
    }
    const totalAyat = data.reduce((sum, s) => sum + s.total_ayat, 0);
    const memorizedAyat = data.reduce((sum, s) => sum + s.memorized_ayat, 0);
    return totalAyat > 0 ? (memorizedAyat / totalAyat) * 100 : 0;
};

export const getDashboardChartData = async () => {
    // This is a complex aggregation, often better done with a database function (RPC in Supabase).
    // The simplified version below fetches recent data and processes it client-side.
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const dateThreshold = threeMonthsAgo.toISOString().split('T')[0];

    const [
        { data: tartiliData },
        { data: hafalanData },
        { data: murojaahData }
    ] = await Promise.all([
        supabase.from('tartili_history').select('date, score').gte('date', dateThreshold),
        supabase.from('hafalan_history').select('date, score').gte('date', dateThreshold),
        supabase.from('murojaah_history').select('date, score').gte('date', dateThreshold)
    ]);

    const aggregateByMonth = (records: {date: string, score: number}[] | null) => {
        if (!records) return {};
        return records.reduce((acc, record) => {
            const month = new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = { total: 0, count: 0 };
            acc[month].total += record.score;
            acc[month].count++;
            return acc;
        }, {} as Record<string, { total: number, count: number }>);
    };

    const tartiliAvg = aggregateByMonth(tartiliData);
    const hafalanAvg = aggregateByMonth(hafalanData);
    const murojaahAvg = aggregateByMonth(murojaahData);

    const allMonths = [...new Set([...Object.keys(tartiliAvg), ...Object.keys(hafalanAvg), ...Object.keys(murojaahAvg)])];
    
    return allMonths.map(month => ({
        name: month,
        tartiliScore: tartiliAvg[month] ? Math.round(tartiliAvg[month].total / tartiliAvg[month].count) : null,
        hafalanScore: hafalanAvg[month] ? Math.round(hafalanAvg[month].total / hafalanAvg[month].count) : null,
        murojaahScore: murojaahAvg[month] ? Math.round(murojaahAvg[month].total / murojaahAvg[month].count) : null,
    }));
};

// --- TEACHER PROFILE ---
export const getTeacherProfile = async (): Promise<TeacherProfile | null> => {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
        console.error("Error fetching teacher profile:", error);
        return null;
    }
    return {
        name: data.name,
        email: data.email,
        profilePic: data.profile_pic_url
    };
};

export const saveTeacherProfile = async (profile: TeacherProfile) => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await supabase.from('profiles').update({
        name: profile.name,
        email: profile.email,
        profile_pic_url: profile.profilePic
    }).eq('id', userId);
};

// --- REPORTING ---
export const getReportDataForClass = async (className: string, startDate: string, endDate: string): Promise<ReportStudentData[]> => {
    const students = await getStudents(className);
    if (!students || students.length === 0) return [];

    const reportData = await Promise.all(students.map(async (student) => {
        const [
            { data: tartiliHistory },
            { data: hafalanHistory },
            { data: murojaahHistory }
        ] = await Promise.all([
            supabase.from('tartili_history').select('date, level, page').eq('student_id', student.id).lte('date', endDate).order('date'),
            supabase.from('hafalan_history').select('date, surah, ayat').eq('student_id', student.id).lte('date', endDate).order('date'),
            supabase.from('murojaah_history').select('date, surah').eq('student_id', student.id).lte('date', endDate).order('date')
        ]);
        
        const findProgress = (history: any[] | null, date: string, fields: string[]) => {
            if (!history) return ' - ';
            const record = history.filter(h => h.date < date).pop();
            return record ? fields.map(f => record[f]).join(' ') : ' - ';
        };
        
        const findLastProgress = (history: any[] | null, fields: string[]) => {
            if (!history || history.length === 0) return ' - ';
            const record = history[history.length - 1];
            return record ? fields.map(f => record[f]).join(' ') : ' - ';
        }

        return {
            id: student.id,
            name: student.name,
            tartili: { awal: findProgress(tartiliHistory, startDate, ['level', 'page']), akhir: findLastProgress(tartiliHistory, ['level', 'page']) },
            hafalan: { awal: findProgress(hafalanHistory, startDate, ['surah', 'ayat']), akhir: findLastProgress(hafalanHistory, ['surah', 'ayat']) },
            murojaah: { awal: findProgress(murojaahHistory, startDate, ['surah']), akhir: findLastProgress(murojaahHistory, ['surah']) },
        };
    }));

    return reportData;
};

// --- DAILY NOTES & REMINDERS ---
export const getDailyNotes = async (): Promise<DailyNote[]> => {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('daily_notes').select('date, content').eq('user_id', userId).order('date', { ascending: false });
    return error ? [] : data;
};

export const saveDailyNote = async (date: string, content: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await supabase.from('daily_notes').upsert({ user_id: userId, date, content }, { onConflict: 'user_id, date' });
};

export const deleteDailyNote = async (date: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await supabase.from('daily_notes').delete().match({ user_id: userId, date });
};

export const getReminders = async (): Promise<Reminder[]> => {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return error ? [] : data;
};

export const getRemindersCount = async (): Promise<{ totalCount: number, unreadCount: number }> => {
    const reminders = await getReminders();
    return { totalCount: reminders.length, unreadCount: reminders.length };
};

export const addReminder = async (content: string) => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await supabase.from('reminders').insert({ user_id: userId, content });
};

export const deleteReminder = async (id: number) => {
    await supabase.from('reminders').delete().eq('id', id);
};

// --- SCHEDULE ---
export const getSchedule = async (): Promise<WeeklySchedule> => {
    const { data, error } = await supabase.from('schedules').select('*');
    if (error) {
        console.error("Error fetching schedule:", error);
        return {};
    }
    const weeklySchedule: WeeklySchedule = {};
    for (const entry of data) {
        if (!weeklySchedule[entry.day_of_week]) {
            weeklySchedule[entry.day_of_week] = {};
        }
        weeklySchedule[entry.day_of_week][entry.class_name] = {
            period: entry.period,
            time: entry.time,
            subject: entry.subject
        };
    }
    return weeklySchedule;
};

export const updateSchedule = async (day: string, className: string, newEntry: ScheduleEntry) => {
    await supabase.from('schedules').update({
        period: newEntry.period,
        time: newEntry.time,
        subject: newEntry.subject
    }).match({ day_of_week: day, class_name: className });
};

// --- SETTINGS & PERSONALIZATION ---
export const saveCustomLogo = async (file: File): Promise<string | null> => {
    const fileName = `public/logo-${Date.now()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
        console.error("Error uploading logo:", uploadError);
        return null;
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);
    const publicUrl = urlData.publicUrl;

    await supabase.from('settings').upsert({ key: 'custom_logo_url', value: publicUrl });

    return publicUrl;
};

export const deleteCustomLogo = async () => {
    const { data } = await supabase.from('settings').select('value').eq('key', 'custom_logo_url').single();

    if (data && data.value) {
        const filePath = data.value.substring(data.value.lastIndexOf('/') + 1);
        if (filePath) {
            await supabase.storage.from(BUCKET_NAME).remove([`public/${filePath}`]);
        }
    }
    
    await supabase.from('settings').delete().eq('key', 'custom_logo_url');
};

export const getCustomLogo = async (): Promise<string | null> => {
    const { data, error } = await supabase.from('settings').select('value').eq('key', 'custom_logo_url').single();
    if (error || !data) {
        return null;
    }
    return data.value;
};

// --- DATA MANAGEMENT (IMPORT/EXPORT) ---
export const exportAllData = async (): Promise<{ success: boolean, message: string, data?: string }> => {
    try {
        const tables = [
            'students', 'tartili_history', 'hafalan_history', 'murojaah_history', 
            'hafalan_targets', 'daily_notes', 'reminders', 'schedules', 'settings', 'profiles'
        ];
        
        const exportedData: { [key: string]: any[] } = {};

        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) throw new Error(`Error exporting ${table}: ${error.message}`);
            exportedData[table] = data || [];
        }

        return { success: true, message: 'Export successful!', data: JSON.stringify(exportedData, null, 2) };
    } catch (e) {
        const err = e as Error;
        console.error("Export error:", err);
        return { success: false, message: `Export failed: ${err.message}` };
    }
};

export const importAllData = async (jsonString: string): Promise<{ success: boolean, message: string }> => {
    try {
        const dataToImport = JSON.parse(jsonString);

        // Clear data, respecting foreign key constraints by deleting children first.
        await supabase.from('tartili_history').delete().gt('id', -1);
        await supabase.from('hafalan_history').delete().gt('id', -1);
        await supabase.from('murojaah_history').delete().gt('id',-1);
        await supabase.from('hafalan_targets').delete().gt('id',-1);
        await supabase.from('students').delete().gt('id', -1);
        
        const userId = await getCurrentUserId();
        if (userId) {
            await supabase.from('daily_notes').delete().eq('user_id', userId);
            await supabase.from('reminders').delete().eq('user_id', userId);
        }

        await supabase.from('schedules').delete().gt('id', -1);
        await supabase.from('settings').delete().neq('key', 'a-non-existent-key');
        
        // Insert data, parents first.
        if (dataToImport.students) await supabase.from('students').insert(dataToImport.students);
        if (dataToImport.tartili_history) await supabase.from('tartili_history').insert(dataToImport.tartili_history);
        if (dataToImport.hafalan_history) await supabase.from('hafalan_history').insert(dataToImport.hafalan_history);
        if (dataToImport.murojaah_history) await supabase.from('murojaah_history').insert(dataToImport.murojaah_history);
        if (dataToImport.hafalan_targets) await supabase.from('hafalan_targets').insert(dataToImport.hafalan_targets);
        if (dataToImport.daily_notes) await supabase.from('daily_notes').insert(dataToImport.daily_notes);
        if (dataToImport.reminders) await supabase.from('reminders').insert(dataToImport.reminders);
        if (dataToImport.schedules) await supabase.from('schedules').insert(dataToImport.schedules);
        
        if (dataToImport.settings) await supabase.from('settings').upsert(dataToImport.settings);
        if (dataToImport.profiles) await supabase.from('profiles').upsert(dataToImport.profiles);

        return { success: true, message: 'Data berhasil diimpor! Aplikasi akan dimuat ulang.' };
    } catch (e) {
        const err = e as Error;
        console.error("Import error:", err);
        return { success: false, message: `Import failed: ${err.message}` };
    }
};
