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
import { initializeDB, getReminders } from './data/dataService';
import LandingPage from './components/LandingPage';
import StudentLoginPage from './components/StudentLoginPage';
import StudentDashboard from './components/StudentDashboard';
import DailyNotesPage from './components/DailyNotesPage';
import RemindersPage from './components/RemindersPage';
import PengaturanPage from './components/PengaturanPage';

type UserType = 'teacher' | 'student';
type LoginView = 'landing' | 'teacher' | 'student';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loginView, setLoginView] = useState<LoginView>('landing');
  const [loggedInStudentId, setLoggedInStudentId] = useState<number | null>(null);

  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [unreadReminderCount, setUnreadReminderCount] = useState(0);

  const refreshReminderCounts = () => {
    const totalCount = getReminders().length;
    const lastSeenTotal = parseInt(localStorage.getItem('lastSeenReminderTotal') || '0');
    const unreadCount = totalCount - lastSeenTotal;
    setUnreadReminderCount(Math.max(0, unreadCount));
  };
  
  const markRemindersAsRead = () => {
    const totalCount = getReminders().length;
    localStorage.setItem('lastSeenReminderTotal', String(totalCount));
    setUnreadReminderCount(0);
  };

  useEffect(() => {
    initializeDB();
    refreshReminderCounts();
  }, []);

  const handleTeacherLogin = () => {
    setUserType('teacher');
    setLoginView('landing'); // Reset login view
    setActivePage(Page.Dashboard);
  };

  const handleStudentLogin = (studentId: number) => {
    setUserType('student');
    setLoggedInStudentId(studentId);
    setLoginView('landing'); // Reset login view
  };

  const handleLogout = () => {
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
    setActivePage(Page.Profil); // Switch to profile view context
  };

  const handleBackToProfileList = () => {
    setSelectedStudentId(null);
    setActivePage(Page.Profil); // Go back to the list view
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
        return <TeacherLoginPage onLogin={handleTeacherLogin} onBack={handleBackToLanding} />;
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

  if (!userType) {
    return renderLoginFlow();
  }

  if (userType === 'student' && loggedInStudentId) {
    return <StudentDashboard studentId={loggedInStudentId} onLogout={handleLogout} />;
  }
  
  if (userType === 'teacher') {
    return (
      <div className="min-h-screen flex flex-col md:flex-row text-white font-sans">
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
      </div>
    );
  }

  return null;
};

export default App;