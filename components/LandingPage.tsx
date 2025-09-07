import React from 'react';
import Icon from './Icon';
import Logo from './Logo';

interface LandingPageProps {
  onSelectTeacherLogin: () => void;
  onSelectStudentLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectTeacherLogin, onSelectStudentLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md animate-fade-in text-center">
        <Logo className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Selamat Datang di TQA APP</h1>
        <p className="text-gray-300 mt-2 text-lg font-medium">MI Al Irsyad Kota Madiun</p>

        <div className="mt-12 space-y-6">
          <button
            onClick={onSelectTeacherLogin}
            className="w-full bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-xl p-6 flex items-center space-x-4 text-left hover:bg-brand-accent/20 transition-all duration-300 transform hover:scale-105"
          >
            <div className="bg-brand-accent p-3 rounded-lg">
                <Icon name="profil" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Masuk sebagai Guru</h2>
              <p className="text-gray-400">Kelola data dan pantau perkembangan siswa.</p>
            </div>
          </button>
          
          <button
            onClick={onSelectStudentLogin}
            className="w-full bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-xl p-6 flex items-center space-x-4 text-left hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105"
          >
             <div className="bg-purple-600 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Masuk sebagai Siswa</h2>
              <p className="text-gray-400">Lihat progres dan riwayat setoran hafalanmu.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;