
import React from 'react';
import { Page } from '../types';
import Icon from './Icon';
import Logo from './Logo';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  remindersCount: number;
}

const NavItem: React.FC<{
  page: Page;
  iconName: 'dashboard' | 'target' | 'input' | 'laporan' | 'profil' | 'schedule' | 'notes' | 'bookmark';
  activePage: Page;
  onClick: () => void;
  badgeCount?: number;
}> = ({ page, iconName, activePage, onClick, badgeCount }) => {
  const isActive = activePage === page;
  return (
    <li
      onClick={onClick}
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-200 relative ${
        isActive
          ? 'bg-brand-accent/10 text-brand-accent font-semibold'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-accent rounded-r-full"></span>}
      <Icon name={iconName} className="w-6 h-6" />
      <span className="font-medium">{page}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="ml-auto bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, remindersCount }) => {
  return (
    <>
      <aside className="w-full md:w-64 bg-white dark:bg-dark-card border-r border-border dark:border-dark-border p-4 md:p-6 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <Logo className="w-10 h-10" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">TQA App</h1>
          </div>
          <nav>
            <ul className="space-y-3">
              <NavItem page={Page.Dashboard} iconName="dashboard" activePage={activePage} onClick={() => setActivePage(Page.Dashboard)} />
              <NavItem page={Page.TargetHafalan} iconName="target" activePage={activePage} onClick={() => setActivePage(Page.TargetHafalan)} />
              <NavItem page={Page.InputData} iconName="input" activePage={activePage} onClick={() => setActivePage(Page.InputData)} />
              <NavItem page={Page.Laporan} iconName="laporan" activePage={activePage} onClick={() => setActivePage(Page.Laporan)} />
              <NavItem page={Page.JadwalPelajaran} iconName="schedule" activePage={activePage} onClick={() => setActivePage(Page.JadwalPelajaran)} />
              <NavItem page={Page.Profil} iconName="profil" activePage={activePage} onClick={() => setActivePage(Page.Profil)} />
              <NavItem page={Page.CatatanHarian} iconName="notes" activePage={activePage} onClick={() => setActivePage(Page.CatatanHarian)} />
              <NavItem page={Page.Pengingat} iconName="bookmark" activePage={activePage} onClick={() => setActivePage(Page.Pengingat)} badgeCount={remindersCount} />
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
