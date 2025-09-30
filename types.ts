

export interface Student {
  id: number;
  name: string;
  class: string;
}

export interface Surah {
  id: number;
  name: string;
  totalAyat: number;
}

export enum Page {
  Dashboard = "Dashboard",
  TargetHafalan = "Target Hafalan",
  InputData = "Input Data",
  Laporan = "Laporan",
  JadwalPelajaran = "Jadwal Pelajaran",
  Profil = "Profil Siswa",
  CatatanHarian = "Catatan Harian",
  Pengingat = "Pengingat",
  Pengaturan = "Pengaturan",
}

export interface TartiliRecord {
  date: string;
  level: string;
  page: string;
  score: number;
  notes?: string;
}

export interface HafalanRecord {
  date: string;
  surah: string;
  ayat: string; // e.g., "1-7"
  score: number;
  notes?: string;
}

export interface MurojaahRecord {
  date: string;
  surah: string;
  score: number;
  notes?: string;
}

export type HafalanStatus = 'Selesai' | 'Sedang Proses' | 'Belum Dimulai';

export interface SurahTarget {
  name: string;
  totalAyat: number;
  memorizedAyat: number;
  status: HafalanStatus;
}

export interface JuzTarget {
  juz: number;
  surahs: SurahTarget[];
}

export interface StudentProfileData {
  id: number;
  name: string;
  class: string;
  joinDate: string;
  profilePic: string | null;
  currentTartiliLevel: string;
  tartiliHistory: TartiliRecord[];
  hafalanHistory: HafalanRecord[];
  murojaahHistory: MurojaahRecord[];
  tartiliChartData: { name: string; score: number }[];
  hafalanChartData: { name: string; score: number }[];
  murojaahChartData: { name: string; score: number }[];
  hafalanTargets: JuzTarget[];
}

export interface ReportProgress {
  awal: string;
  akhir: string;
}

export interface ReportStudentData {
  id: number;
  name: string;
  tartili: ReportProgress;
  hafalan: ReportProgress;
  murojaah: ReportProgress;
}

// Types for Lesson Schedule
export interface ScheduleEntry {
  period: string;
  time: string;
  subject: string;
}
export type DailySchedule = Record<string, ScheduleEntry>; // Key is className
export type WeeklySchedule = Record<string, DailySchedule>; // Key is dayName
// FIX: Added TeacherProfile, DailyNote, and Reminder types.
export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
}

export interface Reminder {
  id: number;
  content: string;
  createdAt: string;
}