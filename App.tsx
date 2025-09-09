
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TeacherLoginPage from './components/TeacherLoginPage';
import ProfilPage from './components/ProfilPage';
import StudentProfile from './components/StudentProfile';
import TargetHafalanDashboard from './components/TargetHafalanDashboard';
import LaporanForm from './components/LaporanForm';
import InputDataForm from './components/InputDataForm';
import { getRemindersCount, getSession, signOut } from './data/dataService';
import LandingPage from './components/LandingPage';
import StudentLoginPage from './components/StudentLoginPage';
import StudentDashboard from './components/StudentDashboard';
import DailyNotesPage from './components/DailyNotesPage';
import RemindersPage from './components/RemindersPage';
import PengaturanPage from './components/PengaturanPage';
import ThemeSwitcher from './components/ThemeSwitcher';
import JadwalPelajaranPage from './components/JadwalPelajaranPage';
import Icon from './components/Icon';

type UserType = 'teacher' | 'student';
type LoginView = 'landing' | 'teacher' | 'student';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loginView, setLoginView] = useState<LoginView>('landing');
  const [loggedInStudentId, setLoggedInStudentId] = useState<number | null>(null);

  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [unreadReminderCount, setUnreadReminderCount] = useState(0);

  // FIX: Make refreshReminderCounts async to await getRemindersCount.
  const refreshReminderCounts = async () => {
    if(!session) return;
    const { totalCount, unreadCount } = await getRemindersCount();
    setUnreadReminderCount(unreadCount);
  };
  
  const markRemindersAsRead = () => {
    localStorage.setItem('lastSeenReminderTotal', String(unreadReminderCount + parseInt(localStorage.getItem('lastSeenReminderTotal') || '0')));
    setUnreadReminderCount(0);
  };

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      if (currentSession) {
        setUserType('teacher');
      }
      setLoading(false);
    };
    checkSession();
  }, []);
  
  useEffect(() => {
      if (session) {
          refreshReminderCounts();
      }
  }, [session]);

  const handleStudentLogin = (studentId: number) => {
    setUserType('student');
    setLoggedInStudentId(studentId);
    setLoginView('landing');
  };

  // FIX: Make handleLogout async to await signOut.
  const handleLogout = async () => {
    await signOut();
    setSession(null);
    setUserType(null);
    setLoginView('landing');
    setLoggedInStudentId(null);
    setSelectedStudentId(null);
    setActivePage(Page.Dashboard);
  };
  
  const handleBackToLanding = () => {
    setLoginView('landing');
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
    setActivePage(Page.Profil);
  };

  const handleBackToProfileList = () => {
    setSelectedStudentId(null);
    setActivePage(Page.Profil);
  };
  
  const renderTeacherContent = () => {
    if (activePage === Page.Profil && selectedStudentId) {
        return <StudentProfile studentId={selectedStudentId} onBack={handleBackToProfileList} />;
    }

    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard onSelectStudent={handleSelectStudent} />;
      case Page.TargetHafalan:
        return <TargetHafalanDashboard onSelectStudent={handleSelectStudent} />;
      case Page.InputData:
        return <InputDataForm />;
      case Page.CatatanHarian:
        return <DailyNotesPage />;
      case Page.Pengingat:
        return <RemindersPage onRemindersUpdate={refreshReminderCounts} />;
      case Page.Laporan:
        return <LaporanForm />;
      case Page.JadwalPelajaran:
        return <JadwalPelajaranPage />;
      case Page.Profil:
        return <ProfilPage onSelectStudent={handleSelectStudent} />;
      case Page.Pengaturan:
        return <PengaturanPage />;
      default:
        return <Dashboard onSelectStudent={handleSelectStudent} />;
    }
  };

  const renderLoginFlow = () => {
    switch(loginView) {
      case 'teacher':
        return <TeacherLoginPage onLogin={() => window.location.reload()} onBack={handleBackToLanding} />;
      case 'student':
        return <StudentLoginPage onLogin={handleStudentLogin} onBack={handleBackToLanding} />;
      case 'landing':
      default:
        return <LandingPage 
          onSelectTeacherLogin={() => setLoginView('teacher')} 
          onSelectStudentLogin={() => setLoginView('student')} 
        />;
    }
  }
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background">
            <div className="flex flex-col items-center gap-4">
                <Icon name="spinner" className="w-12 h-12 text-brand-accent animate-spin-slow" />
                <p className="text-slate-600 dark:text-slate-300">Memuat Aplikasi...</p>
            </div>
        </div>
    );
  }

  if (!userType) {
    return (
      <>
        {renderLoginFlow()}
        <ThemeSwitcher />
      </>
    );
  }

  if (userType === 'student' && loggedInStudentId) {
     return (
        <>
            <StudentDashboard studentId={loggedInStudentId} onLogout={handleLogout} />
            <ThemeSwitcher />
        </>
    );
  }
  
  if (userType === 'teacher' && session) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onLogout={handleLogout} 
          unreadReminderCount={unreadReminderCount}
          onMarkRemindersAsRead={markRemindersAsRead} 
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderTeacherContent()}
        </main>
        <ThemeSwitcher />
      </div>
    );
  }

  return null;
};

export default App;
