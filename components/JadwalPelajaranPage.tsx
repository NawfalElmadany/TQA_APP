
import React, { useState, useEffect, useMemo } from 'react';
import { getSchedule } from '../data/dataService';
import { WeeklySchedule, DailySchedule, ScheduleEntry } from '../types';

const WEEK_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis'];

interface FlatScheduleEntry extends ScheduleEntry {
    className: string;
}

const JadwalPelajaranPage: React.FC = () => {
    const [schedule, setSchedule] = useState<WeeklySchedule>({});
    const [activeDay, setActiveDay] = useState<string>(WEEK_DAYS[0]);

    useEffect(() => {
        const fetchSchedule = async () => {
            setSchedule(await getSchedule());
        };
        fetchSchedule();
    }, []);

    const processedSchedule = useMemo(() => {
        const daySchedule: DailySchedule = schedule[activeDay] || {};
        const flatEntries: FlatScheduleEntry[] = [];

        for (const className in daySchedule) {
            if (Object.prototype.hasOwnProperty.call(daySchedule, className)) {
                const entry = daySchedule[className];
                flatEntries.push({
                    ...entry,
                    className: className,
                });
            }
        }

        return flatEntries.sort((a, b) => {
            const timeA = parseInt(a.time.split(/[:.-]/)[0], 10) * 60 + parseInt(a.time.split(/[:.-]/)[1] || '0', 10);
            const timeB = parseInt(b.time.split(/[:.-]/)[0], 10) * 60 + parseInt(b.time.split(/[:.-]/)[1] || '0', 10);
            return timeA - timeB;
        });
    }, [schedule, activeDay]);
    
    const TabButton: React.FC<{ day: string }> = ({ day }) => {
        const isActive = activeDay === day;
        return (
            <button
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                    isActive
                        ? 'bg-brand-accent text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
                role="tab"
                aria-selected={isActive}
            >
                {day}
            </button>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border dark:border-dark-border pb-5">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">Jadwal Pelajaran</h2>
                <p className="text-slate-500 dark:text-slate-400">Jadwal mengajar mingguan.</p>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex flex-wrap justify-center gap-2 border-b border-border dark:border-dark-border mb-6 pb-4" role="tablist">
                    {WEEK_DAYS.map(day => (
                        <TabButton key={day} day={day} />
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider rounded-tl-lg w-[15%]">Jam Ke-</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-[25%]">Waktu</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-[15%]">Kelas</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider rounded-tr-lg">Mata Pelajaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedSchedule.length > 0 ? processedSchedule.map((row, index) => (
                                <tr key={index} className="border-b border-border dark:border-dark-border last:border-b-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">{row.period}</td>
                                    <td className="p-4 text-sm text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">{row.time}</td>
                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300 font-semibold">{row.className}</td>
                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{row.subject}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-12 text-slate-500 dark:text-slate-400">
                                        Tidak ada jadwal untuk hari {activeDay}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JadwalPelajaranPage;