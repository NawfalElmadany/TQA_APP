import React, { useState, useEffect } from 'react';
import { ScheduleEntry } from '../types';
import { FormGroup, Input, Button } from './FormCard';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleData: {
      day: string;
      className: string;
      entry: ScheduleEntry;
  };
  onSave: (day: string, className: string, newEntry: ScheduleEntry) => void;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ isOpen, onClose, scheduleData, onSave }) => {
  const [period, setPeriod] = useState('');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (scheduleData) {
      setPeriod(scheduleData.entry.period);
      setTime(scheduleData.entry.time);
      setSubject(scheduleData.entry.subject);
    }
  }, [scheduleData]);

  const handleSave = () => {
    onSave(scheduleData.day, scheduleData.className, { period, time, subject });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-card dark:bg-dark-card rounded-xl p-8 w-full max-w-lg mx-4 text-slate-800 dark:text-slate-200 shadow-lg border border-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ubah Jadwal</h2>
            <p className="text-slate-500 dark:text-slate-400">Kelas {scheduleData.className} - Hari {scheduleData.day}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-3xl font-light" aria-label="Tutup modal">&times;</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-6">
                <FormGroup label="Jam Pelajaran">
                    <Input 
                        type="text"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="Contoh: Jam ke 1 & 2"
                    />
                </FormGroup>
                <FormGroup label="Waktu">
                    <Input 
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Contoh: 07.00 - 07.40"
                    />
                </FormGroup>
                <FormGroup label="Materi / Kegiatan">
                    <Input 
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Contoh: Tahfidz & Murojaah"
                    />
                </FormGroup>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    Batal
                </button>
                <Button type="submit">
                    Simpan Perubahan
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
