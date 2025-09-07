import React from 'react';
import Icon from './Icon';
import Logo from './Logo';

interface LandingPageProps {
  onSelectTeacherLogin: () => void;
  onSelectStudentLogin: () => void;
}

const LoginOptionCard: React.FC<{
  onClick: () => void;
  icon: 'profil' | 'tartili';
  title: string;
  description: string;
  iconBgClass: string;
}> = ({ onClick, icon, title, description, iconBgClass }) => (
  <button
    onClick={onClick}
    className="group w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 text-left hover:border-brand-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg transition-colors duration-300 ${iconBgClass}`}>
        <Icon name={icon} className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <div className="mt-6 flex justify-end items-center">
        <span className="text-sm font-medium text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Pilih
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent ml-2 transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </div>
  </button>
);


const LandingPage: React.FC<LandingPageProps> = ({ onSelectTeacherLogin, onSelectStudentLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl animate-fade-in text-center">
        <Logo className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Selamat Datang</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg md:text-xl font-medium">di Aplikasi TQA MI Al Irsyad Kota Madiun</p>
        <p className="mt-8 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Silakan masuk sesuai dengan peran Anda untuk melanjutkan.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoginOptionCard
            onClick={onSelectTeacherLogin}
            icon="profil"
            title="Masuk sebagai Guru"
            description="Kelola data dan pantau perkembangan siswa."
            iconBgClass="bg-brand-accent"
          />
          
          <LoginOptionCard
            onClick={onSelectStudentLogin}
            icon="tartili"
            title="Masuk sebagai Siswa"
            description="Lihat progres dan riwayat setoran hafalanmu."
            iconBgClass="bg-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;