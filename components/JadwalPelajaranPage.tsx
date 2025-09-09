
import React, { useState, useEffect } from 'react';
import { getSchedule, updateSchedule } from '../data/dataService';
import { WeeklySchedule, ScheduleEntry } from '../types';
import Icon from './Icon';
import EditScheduleModal from './EditScheduleModal';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 md:p-8 shadow-sm ${className}`}>
    {children}
  </div>
);

const JadwalPelajaranPage: React.FC = () => {
    const [schedule, setSchedule] = useState<WeeklySchedule>({});
    const [expandedDay, setExpandedDay] = useState<string>('Senin'); // Default to Monday expanded
    const [editingEntry, setEditingEntry] = useState<{ day: string; className: string; entry: ScheduleEntry } | null>(null);
    
    const days = ["Senin", "Selasa", "Rabu", "Kamis"];
    const classes = ["5C", "5D", "6C", "6D"];

    // FIX: Fetch schedule asynchronously.
    useEffect(() => {
        const fetchSchedule = async () => {
            setSchedule(await getSchedule());
        };
        fetchSchedule();
    }, []);
    
    const handleDayToggle = (day: string) => {
        setExpandedDay(prev => (prev === day ? null : day));
    };

    // FIX: Make handleSave async to await updateSchedule.
    const handleSave = async (day: string, className: string, newEntry: ScheduleEntry) => {
        await updateSchedule(day, className, newEntry);
        // Optimistically update local state for immediate feedback
        setSchedule(prev => {
            const newSchedule = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (!newSchedule[day]) {
                newSchedule[day] = {};
            }
            newSchedule[day][className] = newEntry;
            return newSchedule;
        });
        setEditingEntry(null); // Close modal
    };
    
    if (Object.keys(schedule).length === 0) {
        return <div className="text-center p-8">Memuat jadwal...</div>;
    }

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div className="border-b border-border dark:border-dark-border pb-5">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">Jadwal Pelajaran TQA</h2>
                    <p className="text-slate-500 dark:text-slate-400">Lihat dan kelola jadwal Tahsinul Qiro'atil Qur'an untuk setiap kelas.</p>
                </div>
                
                <div className="space-y-4">
                    {days.map(day => {
                        const isExpanded = expandedDay === day;
                        return (
                            <div key={day} className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl transition-all duration-300 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => handleDayToggle(day)}
                                    className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                                    aria-expanded={isExpanded}
                                >
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{`Hari ${day}`}</h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-5 pt-0 animate-fade-in">
                                        <div className="border-t border-border dark:border-dark-border pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {classes.map(className => {
                                                const entry = schedule[day]?.[className];
                                                if (!entry) return null;
                                                return (
                                                    <div key={className} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border dark:border-dark-border relative group">
                                                        <h4 className="font-bold text-lg text-brand-accent mb-3">Kelas {className}</h4>
                                                        <div className="space-y-2 text-sm">
                                                            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                                <Icon name="calendar" className="w-4 h-4 text-slate-400"/>
                                                                <span className="font-medium">{entry.period}</span>
                                                            </p>
                                                            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                <span>{entry.time}</span>
                                                            </p>
                                                            <p className="flex items-start gap-2 text-slate-800 dark:text-slate-100 font-semibold pt-1">
                                                                 <Icon name="bookmark" className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"/>
                                                                <span>{entry.subject}</span>
                                                            </p>
                                                        </div>
                                                        <button 
                                                            onClick={() => setEditingEntry({ day, className, entry })}
                                                            className="absolute top-3 right-3 flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium py-1 px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        >
                                                            <Icon name="edit" className="w-3 h-3"/>
                                                            Ubah
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {editingEntry && (
                <EditScheduleModal
                    isOpen={!!editingEntry}
                    onClose={() => setEditingEntry(null)}
                    onSave={handleSave}
                    scheduleData={editingEntry}
                />
            )}
        </>
    );
};

export default JadwalPelajaranPage;
