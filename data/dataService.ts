import { User, Student, StudentProfileData, TartiliRecord, HafalanRecord, JuzTarget, SurahTarget, HafalanStatus, TeacherProfile, MurojaahRecord, DailyNote, Reminder, ReportStudentData, ReportProgress } from '../types';
import { STUDENTS_INITIAL_NAMES, JUZ_29_SURAHS, JUZ_30_SURAHS, TARTILI_LEVELS } from '../constants';

const DB_KEY = 'al-irsyad-monitoring-data';
const TEACHER_PROFILE_KEY = 'al-irsyad-teacher-profile';
const CUSTOM_LOGO_KEY = 'tqa-app-custom-logo';

interface AppData {
  users: User[];
  students: Student[];
  profiles: StudentProfileData[];
  dailyNotes: DailyNote[];
  reminders: Reminder[];
}

// --- INITIAL DATA GENERATION ---

const generateHafalanTargets = (progressMultiplier: number): JuzTarget[] => {
  const generateSurahStatus = (surah: { name: string, totalAyat: number }, multiplier: number): SurahTarget => {
    const randomFactor = Math.random() * multiplier;
    let memorizedAyat: number;
    let status: HafalanStatus;

    if (randomFactor > 0.8) {
      memorizedAyat = surah.totalAyat;
      status = 'Selesai';
    } else if (randomFactor > 0.3) {
      memorizedAyat = Math.floor(surah.totalAyat * (0.2 + Math.random() * 0.7));
      status = 'Sedang Proses';
    } else {
      memorizedAyat = 0;
      status = 'Belum Dimulai';
    }
    return { ...surah, memorizedAyat, status };
  };

  return [
    { juz: 30, surahs: JUZ_30_SURAHS.map(s => generateSurahStatus(s, progressMultiplier)) },
    { juz: 29, surahs: JUZ_29_SURAHS.map(s => generateSurahStatus(s, progressMultiplier * 0.7)) }
  ];
};

const getInitialData = (): AppData => {
    const students: Student[] = [
      // Kelas 5C
      { id: 1, name: "Bilqis", class: "5C" },
      { id: 2, name: "Attar", class: "5C" },
      { id: 3, name: "Hagia", class: "5C" },
      { id: 4, name: "Ina", class: "5C" },
      { id: 5, name: "Irfan", class: "5C" },
      { id: 6, name: "Kayla", class: "5C" },
      { id: 7, name: "Keanu", class: "5C" },
      { id: 8, name: "Keisha", class: "5C" },
      { id: 9, name: "Aqila", class: "5C" },
      { id: 10, name: "Fathan", class: "5C" },
      // Kelas 5D
      { id: 11, name: "Geo", class: "5D" },
      { id: 12, name: "Husain", class: "5D" },
      { id: 13, name: "Jacinda", class: "5D" },
      { id: 14, name: "Jadda", class: "5D" },
      { id: 15, name: "Laviola", class: "5D" },
      { id: 16, name: "Ahnaf", class: "5D" },
      { id: 17, name: "Dony", class: "5D" },
      { id: 18, name: "Radeva", class: "5D" },
      { id: 19, name: "Nara", class: "5D" },
      { id: 20, name: "Naura", class: "5D" },
      { id: 21, name: "Qaisha", class: "5D" },
      // Kelas 6C
      { id: 22, name: "Khansa", class: "6C" },
      { id: 23, name: "Jovita", class: "6C" },
      { id: 24, name: "Melody Qur'aini", class: "6C" },
      { id: 25, name: "Abidzar", class: "6C" },
      { id: 26, name: "Kenzie", class: "6C" },
      { id: 27, name: "Ulwan", class: "6C" },
      { id: 28, name: "Nada", class: "6C" },
      { id: 29, name: "Queen", class: "6C" },
      { id: 30, name: "Fikri", class: "6C" },
      // Kelas 6D
      { id: 31, name: "Dimas", class: "6D" },
      { id: 32, name: "Dzaky", class: "6D" },
      { id: 33, name: "Faiza", class: "6D" },
      { id: 34, name: "Friska", class: "6D" },
      { id: 35, name: "Alya", class: "6D" },
      { id: 36, name: "Kevin", class: "6D" },
      { id: 37, name: "Alif", class: "6D" },
      { id: 38, name: "Ibad", class: "6D" },
      { id: 39, name: "Malaeka", class: "6D" },
      { id: 40, name: "Melody Anandayu", class: "6D" },
      { id: 41, name: "Tara", class: "6D" },
    ];
    
    const profiles: StudentProfileData[] = students.map(student => ({
      id: student.id,
      name: student.name,
      class: student.class,
      profilePic: null,
      joinDate: `2023-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      currentTartiliLevel: `Tartili ${Math.floor(Math.random() * 4) + 1}`,
      tartiliHistory: [],
      hafalanHistory: [],
      murojaahHistory: [],
      tartiliChartData: [],
      hafalanChartData: [],
      murojaahChartData: [],
      hafalanTargets: generateHafalanTargets(Math.random() * 0.5 + 0.2) // Random progress between 20% and 70%
    }));

    return { users: [], students, profiles, dailyNotes: [], reminders: [] };
}


// --- LOCALSTORAGE HELPER FUNCTIONS ---

const readDB = (): AppData => {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    const parsedData = JSON.parse(data);
    // Ensure properties exist for backward compatibility
    if (!parsedData.users) parsedData.users = [];
    if (!parsedData.dailyNotes) parsedData.dailyNotes = [];
    if (!parsedData.reminders) parsedData.reminders = [];
    return parsedData;
  }
  return getInitialData();
};

const writeDB = (data: AppData) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- AUTHENTICATION ---

export const registerUser = (email: string, password: string): { success: boolean; message: string } => {
    const db = readDB();
    const userExists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
        return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }

    db.users.push({ email, password }); // In a real app, hash the password
    writeDB(db);
    return { success: true, message: 'Registrasi berhasil!' };
};

export const authenticateUser = (email: string, password: string): boolean => {
    // Allow any non-empty email and password for easy login as requested.
    return email.trim() !== '' && password.trim() !== '';
};


// --- PUBLIC API ---

export const initializeDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    console.log('Initializing database with initial data...');
    writeDB(getInitialData());
  } else {
    // Ensure existing DB has all required arrays
    const db = readDB();
    let updated = false;
    if (!db.users) {
        db.users = [];
        updated = true;
    }
    if (!db.dailyNotes) {
        db.dailyNotes = [];
        updated = true;
    }
    if (!db.reminders) {
        db.reminders = [];
        updated = true;
    }
    if (updated) writeDB(db);
  }
};

export const getClasses = (): string[] => {
    const students = readDB().students;
    const uniqueClasses = [...new Set(students.map(s => s.class))];
    return uniqueClasses.sort();
};

export const getStudents = (className?: string): Student[] => {
  const allStudents = readDB().students;
  if (className) {
      return allStudents.filter(s => s.class === className);
  }
  return allStudents;
};

export const getStudentProfileById = (id: number): StudentProfileData | undefined => {
  return readDB().profiles.find(p => p.id === id);
};

export const getAllProfiles = (): StudentProfileData[] => {
    return readDB().profiles;
};

export const addStudent = (name: string, className: string): Student => {
    const db = readDB();
    const newId = (db.students.length > 0 ? Math.max(...db.students.map(s => s.id)) : 0) + 1;
    
    const newStudent: Student = {
        id: newId,
        name,
        class: className.toUpperCase().trim()
    };
    db.students.push(newStudent);
    
    const newProfile: StudentProfileData = {
        id: newId,
        name: name,
        class: className.toUpperCase().trim(),
        joinDate: new Date().toISOString().split('T')[0],
        profilePic: null,
        currentTartiliLevel: TARTILI_LEVELS[0],
        tartiliHistory: [],
        hafalanHistory: [],
        murojaahHistory: [],
        tartiliChartData: [],
        hafalanChartData: [],
        murojaahChartData: [],
        hafalanTargets: generateHafalanTargets(0.1) // Start with low progress
    };
    db.profiles.push(newProfile);

    writeDB(db);
    return newStudent;
};

export const deleteStudent = (studentId: number) => {
    const db = readDB();
    db.students = db.students.filter(s => s.id !== studentId);
    db.profiles = db.profiles.filter(p => p.id !== studentId);
    writeDB(db);
};

export const updateStudentProfile = (id: number, updatedData: Partial<StudentProfileData>) => {
    const db = readDB();
    const profileIndex = db.profiles.findIndex(p => p.id === id);
    if (profileIndex > -1) {
        db.profiles[profileIndex] = { ...db.profiles[profileIndex], ...updatedData };
        
        // Also update the student's name in the students list if it changed
        if (updatedData.name) {
            const studentIndex = db.students.findIndex(s => s.id === id);
            if (studentIndex > -1) {
                db.students[studentIndex].name = updatedData.name;
            }
        }
        
        writeDB(db);
    }
};

export const addTartiliRecord = (studentId: number, record: TartiliRecord) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile) {
        profile.tartiliHistory.unshift(record);
        profile.currentTartiliLevel = record.level; // Update current level
        
        // Update progress chart data
        profile.tartiliChartData.push({ name: new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short' }), score: record.score });

        writeDB(db);
    }
};

export const deleteLastTartiliRecord = (studentId: number) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile && profile.tartiliHistory.length > 0) {
        profile.tartiliHistory.shift();
        profile.tartiliChartData.pop();

        // Revert currentTartiliLevel to the new latest record, or the default if none exist
        if (profile.tartiliHistory.length > 0) {
            profile.currentTartiliLevel = profile.tartiliHistory[0].level;
        } else {
            profile.currentTartiliLevel = TARTILI_LEVELS[0];
        }
        
        writeDB(db);
    }
};

export const graduateStudentTartili = (studentId: number, passedLevel: string, score: number, notes: string, date: string) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile) {
        // 1. Add a record for the drill
        const drillRecord: TartiliRecord = {
            date: date,
            level: passedLevel,
            page: 'Ujian', // Use a descriptive string for drill tests, compatible with new page type.
            score: score,
            notes: `LULUS UJIAN DRILL - ${passedLevel}. ${notes || ''}`.trim(),
        };
        profile.tartiliHistory.unshift(drillRecord);

        // 2. Update the student's current level
        const currentLevelIndex = TARTILI_LEVELS.indexOf(passedLevel);
        if (currentLevelIndex > -1 && currentLevelIndex < TARTILI_LEVELS.length - 1) {
            // Not the last level, promote to the next one
            profile.currentTartiliLevel = TARTILI_LEVELS[currentLevelIndex + 1];
        } else {
            // Last level passed, set a special status
            profile.currentTartiliLevel = "Lulus Tartili";
        }
        
        // 3. Add score to chart
        profile.tartiliChartData.push({ name: new Date(date + 'T00:00:00').toLocaleString('default', { month: 'short' }), score: score });

        writeDB(db);
    }
};

// Helper to robustly recalculate a surah's progress from scratch
const recalculateSurahTarget = (profile: StudentProfileData, surahName: string) => {
    const surahTarget = profile.hafalanTargets.flatMap(j => j.surahs).find(s => s.name === surahName);
    if (surahTarget) {
        // Reset progress
        surahTarget.memorizedAyat = 0;

        // Recalculate by iterating through all relevant history
        const relevantHistory = profile.hafalanHistory.filter(r => r.surah === surahName);
        let totalMemorized = 0;
        for (const record of relevantHistory) {
            const [startAyat, endAyat] = record.ayat.split('-').map(Number);
            const memorizedCount = (endAyat || startAyat) - startAyat + 1;
            totalMemorized += memorizedCount;
        }
        surahTarget.memorizedAyat = totalMemorized;

        // Update status based on recalculated total
        if (surahTarget.memorizedAyat >= surahTarget.totalAyat) {
            surahTarget.status = 'Selesai';
        } else if (surahTarget.memorizedAyat > 0) {
            surahTarget.status = 'Sedang Proses';
        } else {
            surahTarget.status = 'Belum Dimulai';
        }
    }
};


export const addHafalanRecord = (studentId: number, record: HafalanRecord) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile) {
        profile.hafalanHistory.unshift(record);

        // Update progress chart data with hafalan score as well
        profile.hafalanChartData.push({ name: new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short' }), score: record.score });
        
        // A simple logic to update hafalan target status
        const surahTarget = profile.hafalanTargets.flatMap(j => j.surahs).find(s => s.name === record.surah);
        if (surahTarget) {
            const [startAyat, endAyat] = record.ayat.split('-').map(Number);
            const memorizedCount = (endAyat || startAyat) - startAyat + 1;
            surahTarget.memorizedAyat = Math.min(surahTarget.totalAyat, surahTarget.memorizedAyat + memorizedCount);
            if(surahTarget.memorizedAyat >= surahTarget.totalAyat) {
                surahTarget.status = 'Selesai';
            } else if (surahTarget.memorizedAyat > 0) {
                surahTarget.status = 'Sedang Proses';
            }
        }

        writeDB(db);
    }
};

export const deleteLastHafalanRecord = (studentId: number) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile && profile.hafalanHistory.length > 0) {
        const deletedRecord = profile.hafalanHistory.shift();
        profile.hafalanChartData.pop();

        if (deletedRecord) {
            // After deleting the record, recalculate the surah's progress from scratch
            recalculateSurahTarget(profile, deletedRecord.surah);
        }
        
        writeDB(db);
    }
};


export const addMurojaahRecord = (studentId: number, record: MurojaahRecord) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile) {
        if (!profile.murojaahHistory) {
            profile.murojaahHistory = [];
        }
        profile.murojaahHistory.unshift(record);

        // Also add score to chart data
        if (!profile.murojaahChartData) {
            profile.murojaahChartData = [];
        }
        profile.murojaahChartData.push({ name: new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short' }), score: record.score });
        
        writeDB(db);
    }
};

export const deleteLastMurojaahRecord = (studentId: number) => {
    const db = readDB();
    const profile = db.profiles.find(p => p.id === studentId);
    if (profile && profile.murojaahHistory && profile.murojaahHistory.length > 0) {
        profile.murojaahHistory.shift();
        profile.murojaahChartData.pop();
        writeDB(db);
    }
};


// --- TEACHER PROFILE ---
export const getTeacherProfile = (): TeacherProfile => {
    const data = localStorage.getItem(TEACHER_PROFILE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Default data
    return {
        name: 'Ustadz',
        email: 'ustadz@al-irsyad.com',
        profilePic: null,
    };
};

export const saveTeacherProfile = (profile: TeacherProfile) => {
    localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(profile));
};

// --- REMINDERS ---
export const getReminders = (): Reminder[] => {
    const db = readDB();
    // Sort by date descending (newest first)
    return (db.reminders || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addReminder = (content: string): Reminder => {
    const db = readDB();
    if (!db.reminders) {
        db.reminders = [];
    }
    const newId = (db.reminders.length > 0 ? Math.max(...db.reminders.map(r => r.id)) : 0) + 1;
    const newReminder: Reminder = {
        id: newId,
        content,
        createdAt: new Date().toISOString(),
    };
    db.reminders.push(newReminder);
    writeDB(db);
    return newReminder;
};

export const deleteReminder = (id: number) => {
    const db = readDB();
    if (db.reminders) {
        db.reminders = db.reminders.filter(r => r.id !== id);
        writeDB(db);
    }
};

// --- DAILY NOTES ---
export const getDailyNotes = (): DailyNote[] => {
    const db = readDB();
    // Sort by date descending
    return (db.dailyNotes || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const saveDailyNote = (date: string, content: string) => {
    const db = readDB();
    if (!db.dailyNotes) {
        db.dailyNotes = [];
    }
    const noteIndex = db.dailyNotes.findIndex(n => n.date === date);
    
    if (content.trim() === '') {
        // If content is empty, delete the note if it exists
        if (noteIndex > -1) {
            db.dailyNotes.splice(noteIndex, 1);
        }
    } else {
        if (noteIndex > -1) {
            // Update existing note
            db.dailyNotes[noteIndex].content = content;
        } else {
            // Add new note
            db.dailyNotes.push({ date, content });
        }
    }
    writeDB(db);
};

export const deleteDailyNote = (date: string) => {
    const db = readDB();
    if (db.dailyNotes) {
        db.dailyNotes = db.dailyNotes.filter(n => n.date !== date);
        writeDB(db);
    }
};


// --- DYNAMIC DATA FOR DASHBOARD ---

export const getRecentMemorizations = () => {
    const profiles = getAllProfiles();
    const recent = [];
    for (const profile of profiles) {
        if (profile.hafalanHistory.length > 0) {
            const latest = profile.hafalanHistory[0];
            const surahInfo = profile.hafalanTargets.flatMap(j=>j.surahs).find(s => s.name === latest.surah);
            const progress = surahInfo ? (surahInfo.memorizedAyat / surahInfo.totalAyat) * 100 : 0;
            recent.push({
                studentId: profile.id,
                student: profile.name,
                surah: latest.surah,
                progress: Math.round(progress),
                date: latest.date,
            });
        }
    }
    return recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
};


export const getOverallProgress = () => {
    const profiles = getAllProfiles();
    if (profiles.length === 0) return 0;
    
    let totalMemorized = 0;
    let totalTarget = 0;

    for (const profile of profiles) {
        profile.hafalanTargets.forEach(juz => {
            juz.surahs.forEach(surah => {
                totalMemorized += surah.memorizedAyat;
                totalTarget += surah.totalAyat;
            });
        });
    }

    return totalTarget > 0 ? Math.round((totalMemorized / totalTarget) * 100) : 0;
};


export const getDashboardChartData = () => {
    const profiles = getAllProfiles();
    const monthlyData: Record<string, {
        tartiliTotal: number; tartiliCount: number;
        hafalanTotal: number; hafalanCount: number;
        murojaahTotal: number; murojaahCount: number;
    }> = {};

    const processData = (chartData: { name: string; score: number }[], type: 'tartili' | 'hafalan' | 'murojaah') => {
        chartData.forEach(record => {
            if (!monthlyData[record.name]) {
                monthlyData[record.name] = {
                    tartiliTotal: 0, tartiliCount: 0,
                    hafalanTotal: 0, hafalanCount: 0,
                    murojaahTotal: 0, murojaahCount: 0,
                };
            }
            if (type === 'tartili') {
                monthlyData[record.name].tartiliTotal += record.score;
                monthlyData[record.name].tartiliCount++;
            } else if (type === 'hafalan') {
                monthlyData[record.name].hafalanTotal += record.score;
                monthlyData[record.name].hafalanCount++;
            } else { // murojaah
                monthlyData[record.name].murojaahTotal += record.score;
                monthlyData[record.name].murojaahCount++;
            }
        });
    };

    profiles.forEach(p => {
        processData(p.tartiliChartData || [], 'tartili');
        processData(p.hafalanChartData || [], 'hafalan');
        processData(p.murojaahChartData || [], 'murojaah');
    });

    return Object.entries(monthlyData).map(([name, data]) => ({
        name,
        tartiliScore: data.tartiliCount > 0 ? Math.round(data.tartiliTotal / data.tartiliCount) : null,
        hafalanScore: data.hafalanCount > 0 ? Math.round(data.hafalanTotal / data.hafalanCount) : null,
        murojaahScore: data.murojaahCount > 0 ? Math.round(data.murojaahTotal / data.murojaahCount) : null,
    }));
};

// --- REPORTING DATA ---

export const getReportDataForClass = (className: string, startDate: string, endDate: string): ReportStudentData[] => {
  const db = readDB();
  const studentProfiles = db.profiles.filter(p => p.class === className);
  
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T23:59:59');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return []; // Invalid date range
  }

  const reportData = studentProfiles.map(profile => {
    const filterAndSortByDate = <T extends { date: string }>(records: T[]): T[] => {
        return (records || [])
          .filter(r => {
            const recordDate = new Date(r.date + 'T00:00:00');
            return recordDate >= start && recordDate <= end;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort ascending
    };

    // --- Tartili ---
    const tartiliRecords = filterAndSortByDate(profile.tartiliHistory);
    let tartili: ReportProgress = { awal: 'N/A', akhir: 'N/A' };
    if (tartiliRecords.length > 0) {
        const first = tartiliRecords[0];
        const last = tartiliRecords[tartiliRecords.length - 1];
        tartili.awal = `${first.level}, Hal. ${first.page}`;
        tartili.akhir = `${last.level}, Hal. ${last.page}`;
    }

    // --- Hafalan ---
    const hafalanRecords = filterAndSortByDate(profile.hafalanHistory);
    let hafalan: ReportProgress = { awal: 'N/A', akhir: 'N/A' };
    if (hafalanRecords.length > 0) {
        const first = hafalanRecords[0];
        const last = hafalanRecords[hafalanRecords.length - 1];
        hafalan.awal = `${first.surah} ${first.ayat}`;
        hafalan.akhir = `${last.surah} ${last.ayat}`;
    }

    // --- Murojaah ---
    const murojaahRecords = filterAndSortByDate(profile.murojaahHistory);
    let murojaah: ReportProgress = { awal: 'N/A', akhir: 'N/A' };
     if (murojaahRecords.length > 0) {
        const first = murojaahRecords[0];
        const last = murojaahRecords[murojaahRecords.length - 1];
        murojaah.awal = `${first.surah}`;
        murojaah.akhir = `${last.surah}`;
    }

    return {
        id: profile.id,
        name: profile.name,
        tartili,
        hafalan,
        murojaah,
    };
  });

  return reportData.sort((a,b) => a.name.localeCompare(b.name));
};

// --- DATA MANAGEMENT ---

// --- CUSTOM LOGO ---
export const getCustomLogo = (): string | null => {
    return localStorage.getItem(CUSTOM_LOGO_KEY);
};

export const saveCustomLogo = (logoDataUrl: string) => {
    localStorage.setItem(CUSTOM_LOGO_KEY, logoDataUrl);
};

export const deleteCustomLogo = () => {
    localStorage.removeItem(CUSTOM_LOGO_KEY);
};


export const exportAllData = (): { success: boolean, message?: string, data?: string } => {
  try {
    const mainDataString = localStorage.getItem(DB_KEY);
    const teacherProfileString = localStorage.getItem(TEACHER_PROFILE_KEY);

    if (!mainDataString) {
      return { success: false, message: 'Tidak ada data utama untuk diekspor.' };
    }

    const exportObject = {
      db: JSON.parse(mainDataString),
      profile: teacherProfileString ? JSON.parse(teacherProfileString) : getTeacherProfile(),
      logo: getCustomLogo(),
    };

    const jsonString = JSON.stringify(exportObject, null, 2);
    return { success: true, data: jsonString };
  } catch (error) {
    console.error("Error exporting data:", error);
    return { success: false, message: 'Gagal mengekspor data.' };
  }
};

export const importAllData = (jsonString: string): { success: boolean, message: string } => {
  try {
    const data = JSON.parse(jsonString);

    // Basic validation
    if (!data.db || !data.db.students || !data.db.profiles || !data.profile || !data.profile.name) {
      throw new Error("Struktur file tidak valid.");
    }

    localStorage.setItem(DB_KEY, JSON.stringify(data.db));
    localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(data.profile));
    
    if (data.logo) {
      saveCustomLogo(data.logo);
    } else {
      deleteCustomLogo();
    }

    return { success: true, message: 'Data berhasil diimpor! Aplikasi akan dimuat ulang.' };
  } catch (error) {
    console.error("Error importing data:", error);
    const errorMessage = error instanceof Error ? error.message : 'File JSON tidak valid atau rusak.';
    return { success: false, message: `Gagal mengimpor data: ${errorMessage}` };
  }
};