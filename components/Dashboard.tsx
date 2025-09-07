import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRecentMemorizations, getOverallProgress, getDashboardChartData, getTeacherProfile, saveTeacherProfile } from '../data/dataService';
import Icon from './Icon';
import { TeacherProfile } from '../types';
import EditTeacherProfileModal from './EditTeacherProfileModal';

interface DashboardProps {
  onSelectStudent: (id: number) => void;
}

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-6 ${className}`}>
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
          className="stroke-gray-700"
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
      <span className="absolute text-2xl font-bold text-white">{progress}%</span>
    </div>
  );
};


const RecentMemorizationCard: React.FC<{ studentId: number, student: string, surah: string, progress: number, onSelectStudent: (id: number) => void }> = ({ studentId, student, surah, progress, onSelectStudent }) => {
    // Delete functionality is a placeholder. In a real app this would call dataService.
    const handleDelete = () => {
        if (window.confirm(`Fungsi hapus belum diimplementasikan. Apakah Anda ingin melanjutkan?`)) {
            console.log(`Deletion requested for ${student} - Surah: ${surah}`);
        }
    };
    
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between space-x-4 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-slate-700/75 hover:shadow-lg hover:shadow-brand-accent/10">
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => onSelectStudent(studentId)} className="font-semibold text-white hover:text-brand-accent transition-colors duration-200">
                      {student}
                    </button>
                    <span className="text-sm text-gray-400">{surah}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1 text-gray-300">{progress}% Selesai</p>
            </div>
            {/* Edit/Delete buttons can be added back if needed */}
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ onSelectStudent }) => {
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
    <div className="w-16 h-16 rounded-full bg-dark-glass-bg border-2 border-dark-glass-border flex items-center justify-center">
      <Icon name="profil" className="w-8 h-8 text-gray-400" />
    </div>
  );

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-start sm:items-center">
          <div>
              <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
              <p className="text-gray-400">Selamat datang kembali, {teacherProfile?.name || 'Ustadz'}!</p>
              <button 
                onClick={() => setIsEditProfileModalOpen(true)}
                className="text-sm mt-2 text-brand-accent hover:underline flex items-center gap-1.5 p-1 -ml-1"
              >
                <Icon name="edit" className="w-4 h-4" />
                Ubah Profil Guru
              </button>
          </div>
          <div className="relative group cursor-pointer" onClick={() => setIsEditProfileModalOpen(true)}>
              {teacherProfile?.profilePic ? (
                  <img src={teacherProfile.profilePic} alt="Foto Profil" className="w-16 h-16 rounded-full object-cover border-2 border-brand-accent" />
              ) : (
                  defaultAvatar
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ubah profil">
                  <Icon name="camera" className="w-6 h-6 text-white" />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Statistik Perkembangan Rata-rata Siswa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={"rgba(255,255,255,0.1)"} />
                  <XAxis dataKey="name" stroke={"rgba(255,255,255,0.7)"} />
                  <YAxis stroke={"rgba(255,255,255,0.7)"} domain={[70, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{color: '#d1d5db'}}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="tartiliScore" name="Rata-rata Tartili" stroke="hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                  <Line type="monotone" dataKey="hafalanScore" name="Rata-rata Hafalan" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                  <Line type="monotone" dataKey="murojaahScore" name="Rata-rata Murojaah" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4">Progress Target Hafalan</h3>
              <CircularProgress progress={overallProgress} />
          </GlassCard>
        </div>

        <GlassCard>
          <h3 className="text-xl font-semibold mb-4">Hafalan Terbaru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMemorizations.length > 0 ? recentMemorizations.map((item, index) => (
                  <RecentMemorizationCard key={index} {...item} onSelectStudent={onSelectStudent} />
              )) : <p className="text-gray-400 col-span-full text-center">Belum ada data hafalan terbaru.</p>}
          </div>
        </GlassCard>
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