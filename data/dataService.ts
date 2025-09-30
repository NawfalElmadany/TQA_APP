
import { Student, StudentProfileData, TartiliRecord, HafalanRecord, JuzTarget, SurahTarget, HafalanStatus, MurojaahRecord, ReportStudentData, WeeklySchedule, ScheduleEntry, DailyNote, Reminder } from '../types';
import { JUZ_29_SURAHS, JUZ_30_SURAHS, TARTILI_LEVELS } from '../constants';

// --- MOCK DATABASE ---
let mockData = createInitialMockData();

function createInitialMockData() {
    const students = [
        { id: 1, name: 'Ahmad Fauzi', class: '5C', join_date: '2023-01-15', profile_pic_url: null, current_tartili_level: 'Tartili 3' },
        { id: 2, name: 'Budi Santoso', class: '5C', join_date: '2023-01-20', profile_pic_url: null, current_tartili_level: 'Tartili 4' },
        { id: 3, name: 'Citra Lestari', class: '5D', join_date: '2023-02-01', profile_pic_url: null, current_tartili_level: 'Tartili 2' },
        { id: 4, name: 'Dewi Anggraini', class: '6C', join_date: '2023-02-05', profile_pic_url: null, current_tartili_level: 'Tartili 3' },
        { id: 5, name: 'Eka Wijaya', class: '6D', join_date: '2022-08-10', profile_pic_url: null, current_tartili_level: 'Gharib' },
    ];

    const tartili_history = [
        { id: 1, student_id: 1, date: '2024-05-10', level: 'Tartili 3', page: '1-5', score: 90, notes: 'Bagus', created_at: new Date().toISOString() },
        { id: 2, student_id: 2, date: '2024-05-11', level: 'Tartili 4', page: '10', score: 85, notes: 'Perlu latihan lagi', created_at: new Date().toISOString() },
        { id: 3, student_id: 1, date: '2024-04-15', level: 'Tartili 2', page: '20-22', score: 95, notes: 'Sangat lancar', created_at: new Date().toISOString() },
    ];

    const hafalan_history = [
        { id: 1, student_id: 1, date: '2024-05-12', surah: "An-Naba'", ayat: '1-10', score: 88, notes: 'Tajwid cukup baik.', created_at: new Date().toISOString() },
        { id: 2, student_id: 2, date: '2024-05-12', surah: "Al-Ghashiyah", ayat: '1-5', score: 92, notes: 'Lancar', created_at: new Date().toISOString() },
        { id: 3, student_id: 1, date: '2024-05-14', surah: "An-Naba'", ayat: '11-20', score: 90, notes: 'Makhraj huruf ditingkatkan', created_at: new Date().toISOString() },
    ];
    
    const murojaah_history = [
        { id: 1, student_id: 1, date: '2024-05-09', surah: "An-Nas", score: 95, notes: 'Sangat lancar', created_at: new Date().toISOString() },
    ];
    
    let hafalan_targets: any[] = [];
    students.forEach(s => {
        const studentTargets = [
            ...JUZ_30_SURAHS.map(surah => ({ student_id: s.id, juz: 30, surah_name: surah.name, total_ayat: surah.totalAyat, memorized_ayat: 0 })),
            ...JUZ_29_SURAHS.map(surah => ({ student_id: s.id, juz: 29, surah_name: surah.name, total_ayat: surah.totalAyat, memorized_ayat: 0 })),
        ];
        hafalan_targets.push(...studentTargets);
    });

    // Manually update some memorized ayat based on history
    const anNabaTarget = hafalan_targets.find(t => t.student_id === 1 && t.surah_name === "An-Naba'");
    if (anNabaTarget) anNabaTarget.memorized_ayat = 20;
    const alGhashiyahTarget = hafalan_targets.find(t => t.student_id === 2 && t.surah_name === "Al-Ghashiyah");
    if (alGhashiyahTarget) alGhashiyahTarget.memorized_ayat = 5;

    const schedule = {
        'Senin': {
            '5D': { period: '1-2', time: '07:30-08:40', subject: 'TQA' },
            '6D': { period: '3-4', time: '08:40-09:50', subject: 'TQA' },
            '6C': { period: '5-6', time: '10:05-11:15', subject: 'TQA' },
            '5C': { period: '9', time: '13:10-13:45', subject: 'TQA' }
        },
        'Selasa': {
            '6C': { period: '1-2', time: '07:30-08:40', subject: 'TQA' },
            '5C': { period: '3-4', time: '08:40-09:50', subject: 'TQA' },
            '5D': { period: '5-6', time: '10:05-11:15', subject: 'TQA' },
            '6D': { period: '9', time: '13:10-13:45', subject: 'TQA' }
        },
        'Rabu': {
            '5C': { period: '1-2', time: '07:30-08:40', subject: 'TQA' },
            '5D': { period: '5-6', time: '10:05-11:15', subject: 'TQA' },
            '6D': { period: '7-8', time: '11:15-12:25', subject: 'TQA' },
            '6C': { period: '9-11', time: '13:10-14:55', subject: 'TQA & TIK' }
        },
        'Kamis': {
            '5C': { period: '3-4', time: '08:40-09:50', subject: 'TQA' },
            '6C': { period: '5-6', time: '10:05-11:15', subject: 'TQA' },
            '6D': { period: '7-8', time: '11:15-12:25', subject: 'TQA' },
            '5D': { period: '9-11', time: '13:10-14:55', subject: 'TQA & TIK' }
        },
    };

    const users = [
        { id: 1, name: 'Ustadz', email: 'teacher@example.com', password: 'password123' },
    ];

    return {
        students,
        tartili_history,
        hafalan_history,
        murojaah_history,
        hafalan_targets,
        schedule,
        daily_notes: [],
        reminders: [],
        users,
    };
}

let nextIds = {
    student: 6,
    tartili: 4,
    hafalan: 4,
    murojaah: 2,
    reminder: 1,
};

// --- CLASSES & STUDENTS ---
export const getClasses = async (): Promise<string[]> => {
    const classList = mockData.students.map(s => s.class);
    return Promise.resolve([...new Set(classList)].sort());
};

export const getStudents = async (className?: string): Promise<Student[]> => {
    let result = mockData.students;
    if (className) {
        result = result.filter(s => s.class === className);
    }
    return Promise.resolve(result.sort((a, b) => a.name.localeCompare(b.name)));
};

export const getStudentProfileById = async (id: number): Promise<StudentProfileData | null> => {
    const student = mockData.students.find(s => s.id === id);
    if (!student) return Promise.resolve(null);

    const tartiliHistory = mockData.tartili_history.filter(h => h.student_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const hafalanHistory = mockData.hafalan_history.filter(h => h.student_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const murojaahHistory = mockData.murojaah_history.filter(h => h.student_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const hafalanTargetsRaw = mockData.hafalan_targets.filter(t => t.student_id === id);

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

    return Promise.resolve({
        id: student.id,
        name: student.name,
        class: student.class,
        joinDate: student.join_date,
        profilePic: student.profile_pic_url,
        currentTartiliLevel: student.current_tartili_level,
        tartiliHistory,
        hafalanHistory,
        murojaahHistory,
        tartiliChartData: processChartData(tartiliHistory),
        hafalanChartData: processChartData(hafalanHistory),
        murojaahChartData: processChartData(murojaahHistory),
        hafalanTargets,
    });
};

export const getAllProfiles = async (): Promise<StudentProfileData[]> => {
    const profiles = await Promise.all(mockData.students.map(s => getStudentProfileById(s.id)));
    return profiles.filter((p): p is StudentProfileData => p !== null);
};

export const addStudent = async (name: string, className: string) => {
    const newStudentId = nextIds.student++;
    const newStudent = {
        id: newStudentId,
        name: name,
        class: className.toUpperCase().trim(),
        join_date: new Date().toISOString().split('T')[0],
        current_tartili_level: TARTILI_LEVELS[0],
        profile_pic_url: null
    };
    mockData.students.push(newStudent);
    
    const targetsToInsert = [
        ...JUZ_30_SURAHS.map(s => ({ student_id: newStudentId, juz: 30, surah_name: s.name, total_ayat: s.totalAyat, memorized_ayat: 0 })),
        ...JUZ_29_SURAHS.map(s => ({ student_id: newStudentId, juz: 29, surah_name: s.name, total_ayat: s.totalAyat, memorized_ayat: 0 })),
    ];
    mockData.hafalan_targets.push(...targetsToInsert);
    
    return Promise.resolve(newStudent);
};

export const deleteStudent = async (studentId: number) => {
    mockData.students = mockData.students.filter(s => s.id !== studentId);
    mockData.tartili_history = mockData.tartili_history.filter(h => h.student_id !== studentId);
    mockData.hafalan_history = mockData.hafalan_history.filter(h => h.student_id !== studentId);
    mockData.murojaah_history = mockData.murojaah_history.filter(h => h.student_id !== studentId);
    mockData.hafalan_targets = mockData.hafalan_targets.filter(t => t.student_id !== studentId);
    return Promise.resolve();
};

export const updateStudentProfile = async (id: number, updatedData: Partial<StudentProfileData>) => {
    const student = mockData.students.find(s => s.id === id);
    if (student) {
        if (updatedData.name) student.name = updatedData.name;
        if (updatedData.joinDate) student.join_date = updatedData.joinDate;
        if (updatedData.profilePic !== undefined) student.profile_pic_url = updatedData.profilePic;
    }
    return Promise.resolve();
};

// FIX: Add signIn and registerUser functions for authentication.
// --- AUTHENTICATION ---
export const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const user = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
        return Promise.resolve({ error: 'Invalid email or password.' });
    }
    return Promise.resolve({ error: null });
};

export const registerUser = async (email: string, password: string): Promise<{ success: boolean }> => {
    const existingUser = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return Promise.resolve({ success: false });
    }
    const newUser = {
        id: (mockData.users.length > 0 ? Math.max(...mockData.users.map(u => u.id)) : 0) + 1,
        name: 'New Teacher',
        email: email,
        password: password,
    };
    mockData.users.push(newUser);
    return Promise.resolve({ success: true });
};

// --- DATA INPUT & HISTORY ---
const addRecord = (
    history: (TartiliRecord & {id: number, student_id: number, created_at: string})[] | (HafalanRecord & {id: number, student_id: number, created_at: string})[] | (MurojaahRecord & {id: number, student_id: number, created_at: string})[],
    studentId: number,
    record: any,
    nextId: 'tartili' | 'hafalan' | 'murojaah'
) => {
    const newRecord = {
        id: nextIds[nextId]++,
        student_id: studentId,
        ...record,
        created_at: new Date().toISOString(),
    };
    history.unshift(newRecord as any);
};

export const addTartiliRecord = async (studentId: number, record: Omit<TartiliRecord, 'id' | 'student_id' | 'created_at'>) => {
    addRecord(mockData.tartili_history, studentId, record, 'tartili');
    return Promise.resolve();
};

export const addHafalanRecord = async (studentId: number, record: Omit<HafalanRecord, 'id' | 'student_id' | 'created_at'>) => {
    addRecord(mockData.hafalan_history, studentId, record, 'hafalan');
    
    // Update hafalan targets
    const target = mockData.hafalan_targets.find(t => t.student_id === studentId && t.surah_name === record.surah);
    if (target) {
        const [ayatFrom, ayatTo] = record.ayat.split('-').map(Number);
        const lastAyatMemorized = ayatTo || ayatFrom;
        if (lastAyatMemorized > target.memorized_ayat) {
            target.memorized_ayat = lastAyatMemorized;
        }
    }
    return Promise.resolve();
};

export const addMurojaahRecord = async (studentId: number, record: Omit<MurojaahRecord, 'id' | 'student_id' | 'created_at'>) => {
    addRecord(mockData.murojaah_history, studentId, record, 'murojaah');
    return Promise.resolve();
};

const deleteLastRecord = (
    history: ({ student_id: number, created_at: string })[],
    studentId: number
) => {
    const records = history.filter(h => h.student_id === studentId);
    if (records.length > 0) {
        records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastRecord = records[0];
        const index = history.findIndex(h => h === lastRecord);
        if (index > -1) {
            history.splice(index, 1);
        }
    }
};

export const deleteLastTartiliRecord = async (studentId: number) => {
    deleteLastRecord(mockData.tartili_history, studentId);
    return Promise.resolve();
};

export const deleteLastHafalanRecord = async (studentId: number) => {
    deleteLastRecord(mockData.hafalan_history, studentId);
    // Note: Reverting hafalan target progress is complex and omitted for simplicity.
    return Promise.resolve();
};

export const deleteLastMurojaahRecord = async (studentId: number) => {
    deleteLastRecord(mockData.murojaah_history, studentId);
    return Promise.resolve();
};

export const graduateStudentTartili = async (studentId: number, level: string, score: number, notes: string | undefined, date: string) => {
    const student = mockData.students.find(s => s.id === studentId);
    if (student) {
        const currentLevelIndex = TARTILI_LEVELS.indexOf(student.current_tartili_level);
        if (currentLevelIndex !== -1 && currentLevelIndex < TARTILI_LEVELS.length - 1) {
            student.current_tartili_level = TARTILI_LEVELS[currentLevelIndex + 1];
        }
        
        // Add a "LULUS" record to history
        await addTartiliRecord(studentId, {
            date,
            level,
            page: 'LULUS',
            score,
            notes: notes ? `LULUS. ${notes}` : 'LULUS.',
        });
    }
    return Promise.resolve();
};

// --- RECENT MEMORIZATIONS ---
export const getRecentMemorizations = async () => {
    const recent = mockData.hafalan_history
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);
    
    return Promise.resolve(recent.map(r => {
        const student = mockData.students.find(s => s.id === r.student_id);
        const target = mockData.hafalan_targets.find(t => t.student_id === r.student_id && t.surah_name === r.surah);
        const progress = target ? (target.memorized_ayat / target.total_ayat) * 100 : 0;
        return {
            studentId: student?.id,
            student: student?.name || 'Unknown',
            surah: r.surah,
            progress: Math.min(100, progress), // Cap at 100%
        };
    }));
};

export const getOverallProgress = async () => {
    const totalTarget = mockData.hafalan_targets.reduce((sum, t) => sum + t.total_ayat, 0);
    const totalMemorized = mockData.hafalan_targets.reduce((sum, t) => sum + t.memorized_ayat, 0);
    return Promise.resolve(totalTarget > 0 ? (totalMemorized / totalTarget) * 100 : 0);
};

export const getDashboardChartData = async () => {
    const allRecords = [
        ...mockData.tartili_history.map(r => ({ ...r, type: 'tartili' })),
        ...mockData.hafalan_history.map(r => ({ ...r, type: 'hafalan' })),
        ...mockData.murojaah_history.map(r => ({ ...r, type: 'murojaah' })),
    ];

    const groupedByMonth = allRecords.reduce((acc, record) => {
        const month = new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!acc[month]) {
            acc[month] = { tartili: [], hafalan: [], murojaah: [] };
        }
        acc[month][record.type].push(record.score);
        return acc;
    }, {} as Record<string, { tartili: number[], hafalan: number[], murojaah: number[] }>);

    const calculateAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    return Promise.resolve(
        Object.entries(groupedByMonth).map(([month, scores]) => ({
            name: month,
            tartiliScore: calculateAverage(scores.tartili),
            hafalanScore: calculateAverage(scores.hafalan),
            murojaahScore: calculateAverage(scores.murojaah),
        }))
    );
};

// --- REPORTING ---
export const getReportDataForClass = async (className: string, startDate: string, endDate: string): Promise<ReportStudentData[]> => {
    const studentsInClass = mockData.students.filter(s => s.class === className);
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');

    const getProgress = (history: any[], studentId: number) => {
        const studentHistory = history
            .filter(h => h.student_id === studentId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const awalRecord = studentHistory.find(h => new Date(h.date) < start);
        const akhirRecord = studentHistory.filter(h => new Date(h.date) <= end).pop();

        const formatRecord = (r: any, type: 'tartili' | 'hafalan' | 'murojaah') => {
            if (!r) return '-';
            if (type === 'tartili') return `${r.level} Hal. ${r.page}`;
            if (type === 'hafalan') return `${r.surah} Ayat ${r.ayat}`;
            if (type === 'murojaah') return `${r.surah}`;
            return '-';
        }

        return {
            awal: formatRecord(awalRecord, history === mockData.tartili_history ? 'tartili' : history === mockData.hafalan_history ? 'hafalan' : 'murojaah'),
            akhir: formatRecord(akhirRecord, history === mockData.tartili_history ? 'tartili' : history === mockData.hafalan_history ? 'hafalan' : 'murojaah')
        };
    };

    return Promise.resolve(studentsInClass.map(student => ({
        id: student.id,
        name: student.name,
        tartili: getProgress(mockData.tartili_history, student.id),
        hafalan: getProgress(mockData.hafalan_history, student.id),
        murojaah: getProgress(mockData.murojaah_history, student.id)
    })));
};

// --- SCHEDULE ---
export const getSchedule = async (): Promise<WeeklySchedule> => {
    return Promise.resolve(mockData.schedule);
};

export const updateSchedule = async (day: string, className: string, newEntry: ScheduleEntry) => {
    if (mockData.schedule[day] && mockData.schedule[day][className]) {
        mockData.schedule[day][className] = newEntry;
    }
    return Promise.resolve();
};

// --- DAILY NOTES & REMINDERS ---
export const getDailyNotes = async (): Promise<DailyNote[]> => {
    return Promise.resolve(mockData.daily_notes.sort((a,b) => b.date.localeCompare(a.date)));
};

export const saveDailyNote = async (date: string, content: string): Promise<void> => {
    const existingNoteIndex = mockData.daily_notes.findIndex(n => n.date === date);
    if (existingNoteIndex !== -1) {
        mockData.daily_notes[existingNoteIndex].content = content;
    } else {
        mockData.daily_notes.push({ date, content, createdAt: new Date().toISOString() });
    }
    return Promise.resolve();
};

export const deleteDailyNote = async (date: string): Promise<void> => {
    mockData.daily_notes = mockData.daily_notes.filter(n => n.date !== date);
    return Promise.resolve();
};

export const getReminders = async (): Promise<Reminder[]> => {
    return Promise.resolve(mockData.reminders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

export const addReminder = async (content: string): Promise<Reminder> => {
    const newReminder: Reminder = {
        id: nextIds.reminder++,
        content,
        createdAt: new Date().toISOString()
    };
    mockData.reminders.push(newReminder);
    return Promise.resolve(newReminder);
};

export const deleteReminder = async (id: number): Promise<void> => {
    mockData.reminders = mockData.reminders.filter(r => r.id !== id);
    return Promise.resolve();
};

// --- DATA MANAGEMENT ---
export const exportAllData = async () => {
    try {
        const dataToExport = JSON.stringify(mockData, null, 2);
        return { success: true, data: dataToExport };
    } catch (error) {
        console.error("Export failed:", error);
        return { success: false, data: null };
    }
};

export const importAllData = async (jsonData: string) => {
    try {
        const importedData = JSON.parse(jsonData);
        // Basic validation
        if (importedData.students && importedData.tartili_history) {
            // FIX: Add users array if it doesn't exist in the imported data to prevent crashes.
            if (!importedData.users) {
                importedData.users = [{ id: 1, name: 'Ustadz', email: 'teacher@example.com', password: 'password123' }];
            }
            mockData = importedData;
            return { success: true, message: "Data berhasil diimpor! Aplikasi akan dimuat ulang." };
        } else {
            return { success: false, message: "File tidak valid. Pastikan file backup berasal dari aplikasi ini." };
        }
    } catch (error) {
        console.error("Import failed:", error);
        return { success: false, message: "Gagal mengimpor data. File JSON mungkin rusak." };
    }
};
