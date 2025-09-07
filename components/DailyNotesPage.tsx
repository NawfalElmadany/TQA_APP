import React, { useState, useEffect, useRef } from 'react';
import { getDailyNotes, saveDailyNote, deleteDailyNote } from '../data/dataService';
import { DailyNote } from '../types';
import { FormGroup, Input, TextArea, Button, SuccessMessage } from './FormCard';
import Icon from './Icon';
import DeleteNoteConfirmationModal from './DeleteNoteConfirmationModal';

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

// Helper to format date for display
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC', // Ensure consistent date interpretation
    });
};

const DailyNotesPage: React.FC = () => {
    const [notes, setNotes] = useState<DailyNote[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [noteContent, setNoteContent] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    const fetchNotes = () => {
        setNotes(getDailyNotes());
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Effect to load content when selectedDate or notes list changes
    useEffect(() => {
        const noteForDate = notes.find(n => n.date === selectedDate);
        setNoteContent(noteForDate ? noteForDate.content : '');
    }, [selectedDate, notes]);

    const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
        setFeedbackMessage({ type, text });
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    const handleSave = () => {
        const existingNote = notes.find(n => n.date === selectedDate);
        if (existingNote && noteContent.trim() === '') {
            setNoteToDelete(selectedDate);
            return;
        }
        saveDailyNote(selectedDate, noteContent);
        showFeedback('Catatan berhasil disimpan!');
        fetchNotes();
    };
    
    const handleDelete = (dateToDelete: string) => {
        setNoteToDelete(dateToDelete);
    };
    
    const handleConfirmDelete = () => {
        if (noteToDelete) {
            deleteDailyNote(noteToDelete);
            fetchNotes();
            if (noteToDelete === selectedDate) {
                setNoteContent('');
            }
            showFeedback('Catatan telah dihapus.');
            setNoteToDelete(null); // Close the modal
        }
    };

    const handleAddNewNote = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        editorRef.current?.focus();
    };
    
    const handleSelectNote = (note: DailyNote) => {
        setSelectedDate(note.date);
    };

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Catatan Harian Guru</h2>
                    <p className="text-gray-400">Tulis pengingat, refleksi, atau rencana harian Anda di sini.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Column */}
                    <GlassCard className="lg:col-span-2">
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <FormGroup label="Pilih Tanggal">
                                <Input 
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="max-w-xs"
                                />
                            </FormGroup>

                            <FormGroup label={`Tulis Catatan untuk ${formatDate(selectedDate)}`}>
                                <TextArea 
                                    ref={editorRef}
                                    rows={12}
                                    placeholder="Mulai tulis catatan..."
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                            </FormGroup>
                            
                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                                <Button type="submit" className="w-full sm:w-auto">
                                    <Icon name="notes" className="w-5 h-5 mr-2 inline-block"/>
                                    Simpan Catatan
                                </Button>
                                {feedbackMessage && <SuccessMessage>{feedbackMessage.text}</SuccessMessage>}
                            </div>
                        </form>
                    </GlassCard>

                    {/* Side Column */}
                    <div className="space-y-6">
                        <button
                            onClick={handleAddNewNote}
                            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-medium py-3 px-4 rounded-lg hover:bg-brand-accent-darker transition-all duration-300 shadow-lg hover:shadow-brand-accent/40"
                        >
                            <Icon name="plus" className="w-5 h-5" />
                            <span>Buat Catatan Hari Ini</span>
                        </button>
                        
                        <GlassCard className="w-full">
                            <h3 className="text-xl font-semibold mb-4 text-white">Catatan Tersimpan</h3>
                            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
                                {notes.length > 0 ? notes.map(note => (
                                    <div 
                                        key={note.date}
                                        className={`bg-slate-800/50 p-3 rounded-lg group transition-all duration-200 border-2 ${selectedDate === note.date ? 'border-brand-accent' : 'border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-200">{formatDate(note.date)}</p>
                                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{note.content}</p>
                                            </div>
                                            <div className="flex flex-col items-center space-y-1 ml-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleSelectNote(note)}
                                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                                                    aria-label="Lihat atau Ubah Catatan"
                                                >
                                                    <Icon name="edit" className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note.date)}
                                                    className="p-1.5 text-red-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors"
                                                    aria-label="Hapus Catatan"
                                                >
                                                    <Icon name="trash" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-400 text-sm pt-4">Belum ada catatan yang disimpan.</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
            {noteToDelete && (
                <DeleteNoteConfirmationModal
                    isOpen={!!noteToDelete}
                    onClose={() => setNoteToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    noteDate={noteToDelete}
                />
            )}
        </>
    );
};

export default DailyNotesPage;