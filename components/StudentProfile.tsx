
import React from 'react';
import { useState, useEffect } from 'react';
import { getStudentProfileById, updateStudentProfile } from '../data/dataService';
import { StudentProfileData, HafalanStatus, SurahTarget } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EditStudentModal from './EditStudentModal';
import Icon from './Icon';
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

interface StudentProfileProps {
  studentId: number;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
  const { themeMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);

  // FIX: Make fetchStudentData async to await getStudentProfileById.
  const fetchStudentData = async () => {
    const data = await getStudentProfileById(studentId);
    setStudentData(data || null);
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  if (!studentData) {
    return (
      <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Siswa tidak ditemukan</h2>
        <button onClick={onBack} className="mt-4 text-brand-accent hover:underline">Kembali</button>
      </div>
    );
  }

  // FIX: Make handleSaveProfile async to await updateStudentProfile.
  const handleSaveProfile = async (updatedData: Partial<StudentProfileData>) => {
    await updateStudentProfile(studentId, updatedData);
    fetchStudentData(); // Re-fetch to update UI
    setIsEditModalOpen(false);
  };
  
  const { name, currentTartiliLevel, hafalanHistory, tartiliHistory, hafalanTargets, murojaahHistory, tartiliChartData, hafalanChartData, murojaahChartData } = studentData;
  
  const calculateAverage = (data: { score: number }[]) => data.length > 0 ? (data.reduce((acc, item) => acc + item.score, 0) / data.length).toFixed(1) : "N/A";
  const avgTartiliScore = calculateAverage(tartiliChartData);
  const avgHafalanScore = calculateAverage(hafalanChartData);
  const avgMurojaahScore = calculateAverage(murojaahChartData);
  
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
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="bg-card dark:bg-dark-card border border-border dark:border-dark-border text-slate-600 dark:text-slate-300 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-200 flex-shrink-0"
                        aria-label="Kembali"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
                            {studentData.profilePic ? (
                                <img src={studentData.profilePic} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-accent shadow" />
                            ) : (
                                <div className="w-16 h-16 bg-brand-accent/20 dark:bg-brand-accent/30 text-brand-accent dark:text-brand-accent rounded-full flex items-center justify-center font-bold text-3xl flex-shrink-0">
                                    {name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ubah profil">
                                <Icon name="edit" className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{name}</h2>
                            <p className="text-slate-500 dark:text-slate-400">Profil Perkembangan Siswa</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Level Tartili" value={currentTartiliLevel} />
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
        
        {studentData && (
          <EditStudentModal 
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              studentData={studentData}
              onSave={handleSaveProfile}
          />
        )}
    </>
  );
};

export default StudentProfile;
