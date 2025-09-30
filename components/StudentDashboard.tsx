


import React, { useState, useEffect } from 'react';
import { getStudentProfileById, updateStudentProfile } from '../data/dataService';
import { StudentProfileData, HafalanStatus, SurahTarget } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from './Icon';
import StudentProfilePicModal from './StudentProfilePicModal';
import { useTheme } from '../contexts/ThemeContext';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <Card className="text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
    </Card>
);

const HistoryTable: React.FC<{ title: string; headers: string[]; data: (string | number)[][]; }> = ({ title, headers, data }) => (
    <Card>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{title}</h3>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                        {headers.map(header => <th key={header} className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{header}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-dark-border">
                    {data.length > 0 ? data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                            {row.map((cell, cellIndex) => <td key={cellIndex} className="p-3 text-sm text-slate-700 dark:text-slate-300">{cell}</td>)}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center p-4 text-slate-500 dark:text-slate-400">Belum ada riwayat.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);

const StatusBadge: React.FC<{ status: HafalanStatus }> = ({ status }) => {
    const statusStyles = {
        'Selesai': 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
        'Sedang Proses': 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
        'Belum Dimulai': 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const SurahTargetCard: React.FC<{ surah: SurahTarget }> = ({ surah }) => {
    const progress = surah.totalAyat > 0 ? (surah.memorizedAyat / surah.totalAyat) * 100 : 0;
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border dark:border-dark-border">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{surah.name}</h4>
                <StatusBadge status={surah.status} />
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-xs mt-1.5 text-slate-500 dark:text-slate-400">{surah.memorizedAyat}/{surah.totalAyat} Ayat</p>
        </div>
    );
};

const formatDateForTable = (dateString: string) => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

interface StudentDashboardProps {
  studentId: number;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentId, onLogout }) => {
  const { themeMode } = useTheme();
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

  // FIX: Make fetchStudentData async to await getStudentProfileById.
  const fetchStudentData = async () => {
    const data = await getStudentProfileById(studentId);
    setStudentData(data || null);
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  // FIX: Make handleSaveProfilePic async to await updateStudentProfile.
  const handleSaveProfilePic = async (imageDataUrl: string) => {
    await updateStudentProfile(studentId, { profilePic: imageDataUrl });
    fetchStudentData(); // Re-fetch to update UI
    setIsProfilePicModalOpen(false);
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center animate-fade-in text-slate-800 dark:text-slate-200">
        <div>
            <h2 className="text-2xl font-bold">Siswa tidak ditemukan</h2>
            <button onClick={onLogout} className="mt-4 text-brand-accent hover:underline">Kembali ke Halaman Login</button>
        </div>
      </div>
    );
  }
  
  const { name, profilePic, currentTartiliLevel, hafalanHistory, tartiliHistory, hafalanTargets, murojaahHistory, tartiliChartData, hafalanChartData, murojaahChartData } = studentData;
  
  const calculateAverage = (data: { score: number }[]) => data.length > 0 ? (data.reduce((acc, item) => acc + item.score, 0) / data.length).toFixed(1) : "N/A";
  const avgTartiliScore = calculateAverage(tartiliChartData);
  const avgHafalanScore = calculateAverage(hafalanChartData);
  
  const tartiliTableData = tartiliHistory.map(r => [formatDateForTable(r.date), r.level, r.page, r.score, r.notes || '-']);
  const hafalanTableData = hafalanHistory.map(r => [formatDateForTable(r.date), r.surah, r.ayat, r.score, r.notes || '-']);
  const murojaahTableData = (murojaahHistory || []).map(r => [formatDateForTable(r.date), r.surah, r.score, r.notes || '-']);

  const latestHafalanRecord = hafalanHistory?.[0];
  const lastAchievedSurah = latestHafalanRecord 
      ? hafalanTargets.flatMap(j => j.surahs).find(s => s.name === latestHafalanRecord.surah) 
      : null;
      
  const mergedChartData = () => {
      const allMonths = new Set([
          ...tartiliChartData.map(d => d.name),
          ...hafalanChartData.map(d => d.name),
          ...murojaahChartData.map(d => d.name)
      ]);

      return Array.from(allMonths).map(month => {
          const tartili = tartiliChartData.find(d => d.name === month);
          const hafalan = hafalanChartData.find(d => d.name === month);
          const murojaah = murojaahChartData.find(d => d.name === month);
          return {
              name: month,
              tartiliScore: tartili ? tartili.score : null,
              hafalanScore: hafalan ? hafalan.score : null,
              murojaahScore: murojaah ? murojaah.score : null,
          };
      });
  };
  
  const gridColor = themeMode === 'light' ? '#e2e8f0' : '#334155';
  const axisColor = themeMode === 'light' ? '#64748b' : '#94a3b8';
  const tooltipStyle = {
      backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e293b',
      border: `1px solid ${gridColor}`,
      borderRadius: '0.75rem'
  };
  const tooltipLabelStyle = { color: themeMode === 'light' ? '#334155' : '#e2e8f0' };

  return (
    <>
      <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
              <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                      <div className="relative group cursor-pointer" onClick={() => setIsProfilePicModalOpen(true)}>
                          {profilePic ? (
                              <img src={profilePic} alt="Foto Profil" className="w-16 h-16 rounded-full object-cover border-2 border-brand-accent shadow" />
                          ) : (
                              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                  <Icon name="profil" className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                              </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ubah foto profil">
                              <Icon name="camera" className="w-6 h-6 text-white" />
                          </div>
                      </div>
                      <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{name}</h2>
                          <p className="text-slate-500 dark:text-slate-400">Dashboard Siswa</p>
                      </div>
                  </div>
                  <button
                      onClick={onLogout}
                      className="flex items-center space-x-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-medium py-2 px-4 rounded-lg hover:bg-red-200/70 dark:hover:bg-red-500/30 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                  >
                      <Icon name="logout" className="w-5 h-5" />
                      <span>Logout</span>
                  </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Level Tartili Saat Ini" value={currentTartiliLevel} />
                  <StatCard title="Rata-rata Tartili" value={avgTartiliScore} />
                  <StatCard title="Rata-rata Hafalan" value={avgHafalanScore} />
              </div>

              <Card>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Pencapaian Hafalan Terakhir</h3>
                  {lastAchievedSurah ? (
                      <SurahTargetCard surah={lastAchievedSurah} />
                  ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-4">Belum ada pencapaian hafalan yang tercatat.</p>
                  )}
              </Card>

              <Card>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Grafik Nilai Perkembangan</h3>
                  <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mergedChartData()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                              <XAxis dataKey="name" stroke={axisColor} />
                              <YAxis stroke={axisColor} domain={[70, 100]} />
                              <Tooltip 
                                  contentStyle={tooltipStyle}
                                  labelStyle={tooltipLabelStyle}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="tartiliScore" name="Tartili" stroke="#82ca9d" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                              <Line type="monotone" dataKey="hafalanScore" name="Hafalan" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                              <Line type="monotone" dataKey="murojaahScore" name="Murojaah" stroke="#ffc658" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <HistoryTable title="Riwayat Tartili" headers={["Tanggal", "Level", "Hal.", "Nilai", "Catatan"]} data={tartiliTableData} />
                  <HistoryTable title="Riwayat Hafalan" headers={["Tanggal", "Surat", "Ayat", "Nilai", "Catatan"]} data={hafalanTableData} />
                  <div className="lg:col-span-2">
                      <HistoryTable title="Riwayat Murojaah" headers={["Tanggal", "Surat", "Nilai", "Catatan"]} data={murojaahTableData} />
                  </div>
              </div>
          </div>
      </div>
      <StudentProfilePicModal
          isOpen={isProfilePicModalOpen}
          onClose={() => setIsProfilePicModalOpen(false)}
          onSave={handleSaveProfilePic}
      />
    </>
  );
};

export default StudentDashboard;