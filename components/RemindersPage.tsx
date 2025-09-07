import React, { useState, useEffect } from 'react';
import { getReminders, addReminder, deleteReminder } from '../data/dataService';
import { Reminder } from '../types';
import { TextArea, Button, SuccessMessage } from './FormCard';
import Icon from './Icon';
import DeleteReminderConfirmationModal from './DeleteReminderConfirmationModal';

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

interface RemindersPageProps {
    onRemindersUpdate: () => void;
}

const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) {
        console.warn('Web Audio API is not supported in this browser.');
        return;
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Use a 'sine' wave for a clean, simple tone
    oscillator.type = 'sine';
    
    // Set a lower volume for a more subtle sound
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);

    // A single, elegant high-pitched note
    const now = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(1200, now); // A high, clean pitch

    // Quick fade out for a simple "ping" effect
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
};


const RemindersPage: React.FC<RemindersPageProps> = ({ onRemindersUpdate }) => {
  const [newReminderContent, setNewReminderContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);

  const fetchReminders = () => {
    setReminders(getReminders());
  };
  
  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = () => {
    if (newReminderContent.trim()) {
      addReminder(newReminderContent);
      playNotificationSound();
      setFeedbackMessage('Pengingat berhasil ditambahkan!');
      setNewReminderContent('');
      fetchReminders();
      onRemindersUpdate();
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };
  
  const handleConfirmDelete = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete.id);
      fetchReminders();
      onRemindersUpdate();
      setReminderToDelete(null); // Close modal
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Pengingat & Rencana</h2>
            <p className="text-gray-400">Atur pengingat atau rencana untuk kegiatan mengajar.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard>
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Icon name="bookmark" className="w-6 h-6" />
                    Buat Pengingat Baru
                </h3>
                <div>
                    <TextArea
                        rows={8}
                        placeholder="Tulis pengingat, atau agenda penting di sini..."
                        value={newReminderContent}
                        onChange={(e) => setNewReminderContent(e.target.value)}
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <Button
                            type="button"
                            onClick={handleAddReminder}
                            disabled={!newReminderContent.trim()}
                            className="w-auto px-6"
                        >
                            <Icon name="bookmark" className="w-5 h-5 mr-2 inline-block"/>
                            Simpan ke Pengingat
                        </Button>
                        {feedbackMessage && <SuccessMessage>{feedbackMessage}</SuccessMessage>}
                    </div>
                </div>
            </GlassCard>

             <GlassCard>
                <h3 className="text-xl font-semibold mb-4 text-white">Daftar Pengingat Tersimpan</h3>
                <div className="space-y-3 max-h-[24.5rem] overflow-y-auto pr-2">
                    {reminders.length > 0 ? reminders.map(reminder => (
                        <div key={reminder.id} className="bg-slate-800/50 p-3 rounded-lg group flex justify-between items-start gap-3">
                            <div className="flex-grow">
                                <p className="text-gray-200 whitespace-pre-wrap">{reminder.content}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(reminder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            </div>
                            <button
                                onClick={() => setReminderToDelete(reminder)}
                                className="p-1.5 text-red-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                aria-label="Hapus Pengingat"
                            >
                                <Icon name="trash" className="w-4 h-4" />
                            </button>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 text-sm pt-4">Belum ada pengingat yang disimpan.</p>
                    )}
                </div>
            </GlassCard>
        </div>
        
        {reminderToDelete && (
            <DeleteReminderConfirmationModal
                isOpen={!!reminderToDelete}
                onClose={() => setReminderToDelete(null)}
                onConfirm={handleConfirmDelete}
                reminderContent={reminderToDelete.content}
            />
        )}
    </div>
  );
};

export default RemindersPage;