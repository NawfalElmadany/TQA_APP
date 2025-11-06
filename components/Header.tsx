
import React, { useState, useEffect, useRef } from 'react';
import { Page, TeacherProfile } from '../types';
import Icon from './Icon';

interface HeaderProps {
    activePage: Page;
    teacherProfile: TeacherProfile | null;
    onLogoutClick: () => void;
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, teacherProfile, onLogoutClick, onSettingsClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const ProfileAvatar: React.FC<{ profile: TeacherProfile | null, size?: string }> = ({ profile, size = 'w-10 h-10' }) => {
        if (profile?.profilePic) {
            return <img src={profile.profilePic} alt={profile.name} className={`${size} rounded-full object-cover`} />;
        }
        return (
            <div className={`${size} bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                {profile?.name.charAt(0) ?? 'G'}
            </div>
        );
    };

    return (
        <header className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border p-4 flex-shrink-0">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activePage}</h1>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon name="search" className="w-5 h-5 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            className="w-full max-w-xs bg-input dark:bg-dark-input border border-border dark:border-dark-border rounded-lg py-2 pl-10 pr-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    
                    {/* Notifications (static for now) */}
                    <button className="relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">
                        <Icon name="bell" className="w-6 h-6" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                            <ProfileAvatar profile={teacherProfile} />
                            <div className="hidden md:flex flex-col items-start">
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{teacherProfile?.name}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Guru</span>
                            </div>
                             <Icon name="chevron-down" className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-lg py-1 animate-fade-in z-10">
                                <a href="#" onClick={(e) => { e.preventDefault(); onSettingsClick(); setIsDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60">
                                    <Icon name="settings" className="w-5 h-5"/>
                                    <span>Pengaturan</span>
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onLogoutClick(); setIsDropdownOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <Icon name="logout" className="w-5 h-5"/>
                                    <span>Logout</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
