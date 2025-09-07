import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRecentMemorizations, getOverallProgress, getDashboardChartData, getTeacherProfile, saveTeacherProfile } from '../data/dataService';
import Icon from './Icon';
import { TeacherProfile } from '../types';
import EditTeacherProfileModal from './EditTeacherProfileModal';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  onSelectStudent: (id: number) => void;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 shadow-sm ${className}`}>
    {children}
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
      <span className="absolute text-2xl font-bold text-slate-700 dark:text-slate-200">{progress}%</span>
    </div>
  );
};


const RecentMemorizationCard: React.FC<{ studentId: number, student: string, surah: string, progress: number, onSelectStudent: (id: number) => void }> = ({ studentId, student, surah, progress, onSelectStudent }) => {
    return (
        <div className="p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => onSelectStudent(studentId)} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-accent transition-colors duration-200">
                      {student}
                    </button>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{surah}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1 text-slate-500 dark:text-slate-400">{progress}% Selesai</p>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ onSelectStudent }) => {
  const { themeMode } = useTheme();
  const [recentMemorizations, setRecentMemorizations] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  useEffect(() => {
    setRecentMemorizations(getRecentMemorizations());
    setOverallProgress(getOverallProgress());
    setChartData(getDashboardChartData());
    setTeacherProfile(getTeacherProfile());
  }, []);

  const handleSaveProfile = (updatedProfile: TeacherProfile) => {
    saveTeacherProfile(updatedProfile);
    setTeacherProfile(updatedProfile);
    setIsEditProfileModalOpen(false);
  };

  const defaultAvatar = (
    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
      <Icon name="profil" className="w-8 h-8 text-slate-500 dark:text-slate-400" />
    </div>
  );

  const gridColor = themeMode === 'light' ? '#e2e8f0' : '#334155';
  const axisColor = themeMode === 'light' ? '#64748b' : '#94a3b8';
  const tooltipStyle = {
      backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e293b',
      border: `1px solid ${gridColor}`,
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  };
  const tooltipLabelStyle = { color: themeMode === 'light' ? '#334155' : '#e2e8f0' };

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-start sm:items-center">
            <div className="border-b border-border dark:border-dark-border pb-5 flex-grow">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Dashboard</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Selamat datang kembali, {teacherProfile?.name || 'Ustadz'}!</p>
            </div>
          <div className="relative group cursor-pointer ml-6 flex-shrink-0" onClick={() => setIsEditProfileModalOpen(true)}>
              {teacherProfile?.profilePic ? (
                  <img src={teacherProfile.profilePic} alt="Foto Profil" className="w-16 h-16 rounded-full object-cover border-2 border-brand-accent shadow" />
              ) : (
                  defaultAvatar
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ubah profil">
                  <Icon name="camera" className="w-6 h-6 text-white" />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Statistik Perkembangan Rata-rata Siswa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} />
                  <YAxis stroke={axisColor} domain={[70, 100]} />
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="tartiliScore" name="Rata-rata Tartili" stroke="hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                  <Line type="monotone" dataKey="hafalanScore" name="Rata-rata Hafalan" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                  <Line type="monotone" dataKey="murojaahScore" name="Rata-rata Murojaah" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Progress Target Hafalan</h3>
              <CircularProgress progress={overallProgress} />
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Hafalan Terbaru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {recentMemorizations.length > 0 ? recentMemorizations.map((item, index) => (
                  <RecentMemorizationCard key={index} {...item} onSelectStudent={onSelectStudent} />
              )) : <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-4">Belum ada data hafalan terbaru.</p>}
          </div>
        </Card>
      </div>

      <EditTeacherProfileModal 
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          profile={teacherProfile}
          onSave={handleSaveProfile}
      />
    </>
  );
};

export default Dashboard;