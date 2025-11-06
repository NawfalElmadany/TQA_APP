
import React, { useState, useEffect } from 'react';
import { Page, TeacherProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfilPage from './components/ProfilPage';
import StudentProfile from './components/StudentProfile';
import TargetHafalanDashboard from './components/TargetHafalanDashboard';
import LaporanForm from './components/LaporanForm';
import InputDataForm from './components/InputDataForm';
import LandingPage from './components/LandingPage';
import StudentLoginPage from './components/StudentLoginPage';
import StudentDashboard from './components/StudentDashboard';
import PengaturanPage from './components/PengaturanPage';
import ThemeSwitcher from './components/ThemeSwitcher';
import JadwalPelajaranPage from './components/JadwalPelajaranPage';
import CatatanHarianPage from './components/DailyNotesPage';
import PengingatPage from './components/RemindersPage';
import { getReminders, getTeacherProfile } from './data/dataService';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';

type UserType = 'teacher' | 'student';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loggedInStudentId, setLoggedInStudentId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [remindersCount, setRemindersCount] = useState(0);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchRemindersCount = async () => {
    const reminders = await getReminders();
    setRemindersCount(reminders.length);
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
        if (userType === 'teacher') {
            await fetchRemindersCount();
            setTeacherProfile(await getTeacherProfile());
        }
    };
    fetchTeacherData();
  }, [userType]);

  const handleStudentLogin = (studentId: number) => {
    setUserType('student');
    setLoggedInStudentId(studentId);
  };

  const handleLogout = () => {
    setUserType(null);
    setLoggedInStudentId(null);
    setSelectedStudentId(null);
    setActivePage(Page.Dashboard);
    setIsLogoutModalOpen(false);
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
      case Page.Laporan:
        return <LaporanForm />;
      case Page.JadwalPelajaran:
        return <JadwalPelajaranPage />;
      case Page.Profil:
        return <ProfilPage onSelectStudent={handleSelectStudent} />;
      case Page.CatatanHarian:
        return <CatatanHarianPage />;
      case Page.Pengingat:
        return <PengingatPage onRemindersUpdate={fetchRemindersCount} />;
      case Page.Pengaturan:
        return <PengaturanPage />;
      default:
        return <Dashboard onSelectStudent={handleSelectStudent} />;
    }
  };

  if (!userType) {
    return (
      <>
        <LandingPage 
          onSelectTeacherLogin={() => setUserType('teacher')} 
          onSelectStudentLogin={() => setUserType('student')} 
        />
        <ThemeSwitcher />
      </>
    );
  }

  if (userType === 'student') {
     if (loggedInStudentId) {
        return (
            <>
                <StudentDashboard studentId={loggedInStudentId} onLogout={handleLogout} />
                <ThemeSwitcher />
            </>
        );
     } else {
        return (
            <>
                <StudentLoginPage onLogin={handleStudentLogin} onBack={() => setUserType(null)} />
                <ThemeSwitcher />
            </>
        );
     }
  }
  
  if (userType === 'teacher') {
    return (
        <>
            <div className="min-h-screen flex font-sans bg-background dark:bg-dark-background">
                <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                remindersCount={remindersCount}
                />
                <div className="flex-1 flex flex-col h-screen overflow-y-hidden">
                    <Header
                        activePage={activePage}
                        teacherProfile={teacherProfile}
                        onLogoutClick={() => setIsLogoutModalOpen(true)}
                        onSettingsClick={() => setActivePage(Page.Pengaturan)}
                    />
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {renderTeacherContent()}
                    </main>
                </div>
                <ThemeSwitcher />
            </div>
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </>
    );
  }

  return null;
};

export default App;