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
}> = ({ onClick, icon, title, description }) => (
  <button
    onClick={onClick}
    className="group w-full bg-black/20 border border-brand-accent/20 rounded-2xl p-6 text-left hover:border-brand-accent/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="flex items-center space-x-5">
      <div className={`p-4 rounded-xl transition-all duration-300 bg-brand-accent/10 border border-brand-accent/20 group-hover:bg-brand-accent/20 group-hover:border-brand-accent/40`}>
        <Icon name={icon} className="w-8 h-8 text-brand-accent" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
        <p className="text-slate-400 mt-1">{description}</p>
      </div>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 ml-auto transform transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </div>
  </button>
);


const LandingPage: React.FC<LandingPageProps> = ({ onSelectTeacherLogin, onSelectStudentLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-4xl animate-fade-in text-center">
        
        <div className="relative bg-dark-card/50 backdrop-blur-2xl border border-brand-accent/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-brand-accent/10">
            <Logo className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6" />
            <h1 
              className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-50"
              style={{ textShadow: '0 0 15px hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l) / 0.6)'}}
            >
                Selamat Datang
            </h1>
            <p className="text-slate-300 mt-2 text-lg md:text-xl font-medium">
                di Aplikasi TQA MI Al Irsyad Kota Madiun
            </p>
            <p className="mt-8 text-lg text-slate-400 max-w-2xl mx-auto">
                Silakan masuk sesuai dengan peran Anda untuk melanjutkan.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <LoginOptionCard
                onClick={onSelectTeacherLogin}
                icon="profil"
                title="Masuk sebagai Guru"
                description="Kelola data & pantau siswa."
            />
            
            <LoginOptionCard
                onClick={onSelectStudentLogin}
                icon="tartili"
                title="Masuk sebagai Siswa"
                description="Lihat progres hafalanmu."
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;