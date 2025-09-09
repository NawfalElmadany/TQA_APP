
import React, { useState, useEffect } from 'react';
import { getAllProfiles } from '../data/dataService';
import { StudentProfileData } from '../types';

interface TargetHafalanDashboardProps {
  onSelectStudent: (id: number) => void;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border dark:border-dark-border">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
    </div>
);

const CircularProgress: React.FC<{ progress: number, size?: number, strokeWidth?: number }> = ({ progress, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size}>
        <circle
          className="stroke-slate-200 dark:stroke-slate-700"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500"
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l))" />
            <stop offset="100%" stopColor="hsl(var(--color-accent-h) var(--color-accent-s) calc(var(--color-accent-l) + 10%))" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-2xl font-bold text-slate-700 dark:text-slate-200">{progress.toFixed(1)}%</span>
    </div>
  );
};

const TargetHafalanDashboard: React.FC<TargetHafalanDashboardProps> = ({ onSelectStudent }) => {
    const [studentProfiles, setStudentProfiles] = useState<StudentProfileData[]>([]);

    // FIX: Use an async function inside useEffect to fetch data.
    useEffect(() => {
        const fetchData = async () => {
            setStudentProfiles(await getAllProfiles());
        };
        fetchData();
    }, []);

    const studentProgressData = studentProfiles.map(student => {
        const totalTargetAyat = student.hafalanTargets.reduce((sum, juz) => sum + juz.surahs.reduce((s, surah) => s + surah.totalAyat, 0), 0);
        const totalMemorizedAyat = student.hafalanTargets.reduce((sum, juz) => sum + juz.surahs.reduce((s, surah) => s + surah.memorizedAyat, 0), 0);
        const percentage = totalTargetAyat > 0 ? (totalMemorizedAyat / totalTargetAyat) * 100 : 0;
        return {
            id: student.id,
            name: student.name,
            totalMemorizedAyat,
            totalTargetAyat,
            percentage
        };
    }).sort((a, b) => b.percentage - a.percentage);

    const overallTotalAyat = studentProgressData.reduce((sum, s) => sum + s.totalTargetAyat, 0);
    const overallMemorizedAyat = studentProgressData.reduce((sum, s) => sum + s.totalMemorizedAyat, 0);
    const overallProgress = overallTotalAyat > 0 ? (overallMemorizedAyat / overallTotalAyat) * 100 : 0;
    
    const totalTargetSurahs = (studentProfiles[0]?.hafalanTargets || []).reduce((sum,j) => sum + j.surahs.length, 0);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border dark:border-dark-border pb-5">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">Target Hafalan Juz 29 & 30</h2>
                <p className="text-slate-500 dark:text-slate-400">Pantau progres hafalan seluruh siswa secara terpusat.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Progres Keseluruhan</h3>
                    <CircularProgress progress={overallProgress} size={150} strokeWidth={12} />
                </Card>
                <Card className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 content-center">
                    <StatCard title="Total Surat Target" value={totalTargetSurahs} />
                    <StatCard title="Total Siswa" value={studentProfiles.length} />
                    <StatCard title="Total Ayat Target" value={overallTotalAyat.toLocaleString()} />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                     <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Papan Peringkat</h3>
                     <div className="space-y-3">
                        {studentProgressData.slice(0, 5).map((student, index) => (
                             <div key={student.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-between border border-border dark:border-dark-border">
                                <div className="flex items-center space-x-3">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index < 3 ? 'bg-brand-accent/80 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{index + 1}</span>
                                    <button onClick={() => onSelectStudent(student.id)} className="font-medium text-slate-700 dark:text-slate-200 hover:text-brand-accent transition-colors">
                                        {student.name}
                                    </button>
                                </div>
                                <span className="font-semibold text-brand-accent">{student.percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                     </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Progres Semua Siswa</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center">Ayat Dihafal</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center hidden sm:table-cell">Progres</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-dark-border">
                                {studentProgressData.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3">
                                            <button onClick={() => onSelectStudent(student.id)} className="font-medium text-slate-700 dark:text-slate-200 hover:text-brand-accent transition-colors">
                                                {student.name}
                                            </button>
                                        </td>
                                        <td className="p-3 text-center text-sm text-slate-600 dark:text-slate-300">{student.totalMemorizedAyat.toLocaleString()} / {student.totalTargetAyat.toLocaleString()}</td>
                                        <td className="p-3 text-center hidden sm:table-cell">
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                                <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${student.percentage}%` }}></div>
                                            </div>
                                            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{student.percentage.toFixed(1)}%</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TargetHafalanDashboard;
