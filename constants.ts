import type { Surah } from './types';

export const STUDENTS_INITIAL_NAMES: string[] = [
  "Ahmad Fauzi",
  "Budi Santoso",
  "Citra Lestari",
  "Dewi Anggraini",
  "Eka Wijaya",
];

export const SURAHS: Surah[] = [
  { id: 1, name: "Al-Fatihah", totalAyat: 7 },
  { id: 112, name: "Al-Ikhlas", totalAyat: 4 },
  { id: 113, name: "Al-Falaq", totalAyat: 5 },
  { id: 114, name: "An-Nas", totalAyat: 6 },
  { id: 78, name: "An-Naba'", totalAyat: 40 },
  { id: 88, name: "Al-Ghashiyah", totalAyat: 26 },
  { name: "An-Nazi'at", totalAyat: 46 }, { name: "'Abasa", totalAyat: 42 },
  { name: "At-Takwir", totalAyat: 29 }, { name: "Al-Infitar", totalAyat: 19 }, { name: "Al-Mutaffifin", totalAyat: 36 },
  { name: "Al-Inshiqaq", totalAyat: 25 }, { name: "Al-Buruj", totalAyat: 22 }, { name: "At-Tariq", totalAyat: 17 },
  { name: "Al-A'la", totalAyat: 19 }, { name: "Al-Fajr", totalAyat: 30 },
  { name: "Al-Balad", totalAyat: 20 }, { name: "Ash-Shams", totalAyat: 15 }, { name: "Al-Lail", totalAyat: 21 },
  { name: "Ad-Duha", totalAyat: 11 }, { name: "Ash-Sharh", totalAyat: 8 }, { name: "At-Tin", totalAyat: 8 },
  { name: "'Alaq", totalAyat: 19 }, { name: "Al-Qadr", totalAyat: 5 }, { name: "Al-Bayyinah", totalAyat: 8 },
  { name: "Az-Zalzalah", totalAyat: 8 }, { name: "Al-'Adiyat", totalAyat: 11 }, { name: "Al-Qari'ah", totalAyat: 11 },
  { name: "At-Takathur", totalAyat: 8 }, { name: "Al-'Asr", totalAyat: 3 }, { name: "Al-Humazah", totalAyat: 9 },
  { name: "Al-Fil", totalAyat: 5 }, { name: "Quraysh", totalAyat: 4 }, { name: "Al-Ma'un", totalAyat: 7 },
  { name: "Al-Kawthar", totalAyat: 3 }, { name: "Al-Kafirun", totalAyat: 6 }, { name: "An-Nasr", totalAyat: 3 },
  { name: "Al-Masad", totalAyat: 5 },
  // Juz 29
  { name: "Al-Mulk", totalAyat: 30 }, { name: "Al-Qalam", totalAyat: 52 }, { name: "Al-Haqqah", totalAyat: 52 },
  { name: "Al-Ma'arij", totalAyat: 44 }, { name: "Nuh", totalAyat: 28 }, { name: "Al-Jinn", totalAyat: 28 },
  { name: "Al-Muzzammil", totalAyat: 20 }, { name: "Al-Muddaththir", totalAyat: 56 }, { name: "Al-Qiyamah", totalAyat: 40 },
  { name: "Al-Insan", totalAyat: 31 }, { name: "Al-Mursalat", totalAyat: 50 },
  // Juz 28
  { name: "Al-Mujadila", totalAyat: 22 },
  { name: "Al-Hashr", totalAyat: 24 },
  { name: "Al-Mumtahanah", totalAyat: 13 },
  { name: "As-Saff", totalAyat: 14 },
  { name: "Al-Jumu'ah", totalAyat: 11 },
  { name: "Al-Munafiqun", totalAyat: 11 },
  { name: "At-Taghabun", totalAyat: 18 },
  { name: "At-Talaq", totalAyat: 12 },
  { name: "At-Tahrim", totalAyat: 12 },
  // Juz 27
  { name: "Adh-Dhariyat", totalAyat: 60 },
  { name: "At-Tur", totalAyat: 49 },
  { name: "An-Najm", totalAyat: 62 },
  { name: "Al-Qamar", totalAyat: 55 },
  { name: "Ar-Rahman", totalAyat: 78 },
  { name: "Al-Waqi'ah", totalAyat: 96 },
  { name: "Al-Hadid", totalAyat: 29 },
].map((s, i) => ({ ...s, id: i + 100 })); // Assign unique IDs

export const TARTILI_LEVELS: string[] = [
  "Tartili 1",
  "Tartili 2",
  "Tartili 3",
  "Tartili 4",
  "Tartili 5",
  "Tartili 6",
  "Gharib",
  "Al Baqarah",
];

export const JUZ_30_SURAHS = [
    { name: "An-Naba'", totalAyat: 40 }, { name: "An-Nazi'at", totalAyat: 46 }, { name: "'Abasa", totalAyat: 42 },
    { name: "At-Takwir", totalAyat: 29 }, { name: "Al-Infitar", totalAyat: 19 }, { name: "Al-Mutaffifin", totalAyat: 36 },
    { name: "Al-Inshiqaq", totalAyat: 25 }, { name: "Al-Buruj", totalAyat: 22 }, { name: "At-Tariq", totalAyat: 17 },
    { name: "Al-A'la", totalAyat: 19 }, { name: "Al-Ghashiyah", totalAyat: 26 }, { name: "Al-Fajr", totalAyat: 30 },
    { name: "Al-Balad", totalAyat: 20 }, { name: "Ash-Shams", totalAyat: 15 }, { name: "Al-Lail", totalAyat: 21 },
    { name: "Ad-Duha", totalAyat: 11 }, { name: "Ash-Sharh", totalAyat: 8 }, { name: "At-Tin", totalAyat: 8 },
    { name: "'Alaq", totalAyat: 19 }, { name: "Al-Qadr", totalAyat: 5 }, { name: "Al-Bayyinah", totalAyat: 8 },
    { name: "Az-Zalzalah", totalAyat: 8 }, { name: "Al-'Adiyat", totalAyat: 11 }, { name: "Al-Qari'ah", totalAyat: 11 },
    { name: "At-Takathur", totalAyat: 8 }, { name: "Al-'Asr", totalAyat: 3 }, { name: "Al-Humazah", totalAyat: 9 },
    { name: "Al-Fil", totalAyat: 5 }, { name: "Quraysh", totalAyat: 4 }, { name: "Al-Ma'un", totalAyat: 7 },
    { name: "Al-Kawthar", totalAyat: 3 }, { name: "Al-Kafirun", totalAyat: 6 }, { name: "An-Nasr", totalAyat: 3 },
    { name: "Al-Masad", totalAyat: 5 }, { name: "Al-Ikhlas", totalAyat: 4 }, { name: "Al-Falaq", totalAyat: 5 },
    { name: "An-Nas", totalAyat: 6 }
];

export const JUZ_29_SURAHS = [
    { name: "Al-Mulk", totalAyat: 30 }, { name: "Al-Qalam", totalAyat: 52 }, { name: "Al-Haqqah", totalAyat: 52 },
    { name: "Al-Ma'arij", totalAyat: 44 }, { name: "Nuh", totalAyat: 28 }, { name: "Al-Jinn", totalAyat: 28 },
    { name: "Al-Muzzammil", totalAyat: 20 }, { name: "Al-Muddaththir", totalAyat: 56 }, { name: "Al-Qiyamah", totalAyat: 40 },
    { name: "Al-Insan", totalAyat: 31 }, { name: "Al-Mursalat", totalAyat: 50 }
];

export const JUZ_28_SURAHS = [
    { name: "Al-Mujadila", totalAyat: 22 },
    { name: "Al-Hashr", totalAyat: 24 },
    { name: "Al-Mumtahanah", totalAyat: 13 },
    { name: "As-Saff", totalAyat: 14 },
    { name: "Al-Jumu'ah", totalAyat: 11 },
    { name: "Al-Munafiqun", totalAyat: 11 },
    { name: "At-Taghabun", totalAyat: 18 },
    { name: "At-Talaq", totalAyat: 12 },
    { name: "At-Tahrim", totalAyat: 12 }
];

export const JUZ_27_SURAHS = [
    { name: "Adh-Dhariyat", totalAyat: 60 },
    { name: "At-Tur", totalAyat: 49 },
    { name: "An-Najm", totalAyat: 62 },
    { name: "Al-Qamar", totalAyat: 55 },
    { name: "Ar-Rahman", totalAyat: 78 },
    { name: "Al-Waqi'ah", totalAyat: 96 },
    { name: "Al-Hadid", totalAyat: 29 }
];