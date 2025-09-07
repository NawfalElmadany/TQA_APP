import React, { useState, useEffect, useRef } from 'react';
import { FormGroup, Select, Input, TextArea, Button, ErrorMessage } from './FormCard';
import { SURAHS } from '../constants';
import { getStudents, addMurojaahRecord, getClasses, deleteLastMurojaahRecord } from '../data/dataService';
import { Student } from '../types';
import Icon from './Icon';

interface LastSubmission {
  studentId: number;
  studentName: string;
  surah: string;
  score: number;
  notes?: string;
  date: string;
}

const MurojaahForm: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  const [studentId, setStudentId] = useState<string>('');
  const [surah, setSurah] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ selectedClass?: string; studentId?: string; surah?: string; score?: string }>({});
  
  const [lastSubmission, setLastSubmission] = useState<LastSubmission | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [undoMessage, setUndoMessage] = useState<string>('');


  useEffect(() => {
    setClasses(getClasses());

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Speech Recognition not supported by this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = `Terjadi kesalahan: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = 'Tidak ada suara terdeteksi. Silakan coba lagi dan pastikan Anda berbicara dengan jelas.';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'Izin mikrofon ditolak. Aktifkan izin mikrofon di pengaturan browser Anda untuk menggunakan fitur ini.';
      } else if (event.error === 'network') {
          errorMessage = 'Masalah jaringan. Fitur suara memerlukan koneksi internet.';
      }
      setSpeechError(errorMessage);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && transcript.trim()) {
        handleVoiceResult(transcript);
      } else {
        setSpeechError("Tidak dapat mengenali ucapan Anda. Mohon coba lagi.");
      }
    };
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    if (newClass) {
      setFilteredStudents(getStudents(newClass));
    } else {
      setFilteredStudents([]);
    }
    setStudentId(''); // Reset student when class is changed manually
  };

  const parseDateFromTranscript = (transcript: string): string | null => {
      const today = new Date();
      if (transcript.includes('kemarin')) {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
          return yesterday.toISOString().split('T')[0];
      }
      if (transcript.includes('hari ini')) {
          today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
          return today.toISOString().split('T')[0];
      }
  
      const monthMap: { [key: string]: number } = {
          'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
          'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11,
      };
      const dateRegex = /tanggal\s+(\d{1,2})\s+([a-zA-Z]+)(?:\s+(\d{4}))?/;
      const match = transcript.match(dateRegex);
  
      if (match) {
          const day = parseInt(match[1], 10);
          const monthName = match[2].toLowerCase();
          const year = match[3] ? parseInt(match[3], 10) : today.getFullYear();
  
          if (monthMap[monthName] !== undefined) {
              const month = monthMap[monthName];
              const parsedDate = new Date(year, month, day);
              parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
              return parsedDate.toISOString().split('T')[0];
          }
      }
      return null;
  };

  const handleVoiceResult = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    console.log('Voice Transcript:', lowerTranscript);

    // Helper function to normalize text for better matching
    const normalize = (text: string) => text.toLowerCase().replace(/['\- ]/g, '');
    const normalizedTranscript = normalize(transcript);
    
    // --- Parse All Potential Fields ---
    const allStudents = getStudents();
    const studentMatch = allStudents.find(s => lowerTranscript.includes(s.name.toLowerCase()));

    // Improved surah matching
    const surahMatch = SURAHS.find(s => normalizedTranscript.includes(normalize(s.name)));
    
    const scoreMatch = lowerTranscript.match(/nilai\s+(\d+)/);
    const notesMatch = lowerTranscript.match(/catatan(nya)?\s+(.*)/);
    const dateMatch = parseDateFromTranscript(lowerTranscript);

    // --- State Updates ---
    if (dateMatch) setDate(dateMatch);

    if (studentMatch) {
      const studentClass = studentMatch.class;
      const studentsInThatClass = getStudents(studentClass);
      setSelectedClass(studentClass);
      setFilteredStudents(studentsInThatClass);
      setStudentId(String(studentMatch.id));
    } else {
      const classMatch = lowerTranscript.match(/kelas\s+([a-zA-Z0-9\s]+)/);
      if (classMatch) {
        const parsedClassName = classMatch[1].trim().toUpperCase().replace(/\s+/g, '');
        const foundClass = classes.find(c => c.replace(/\s+/g, '') === parsedClassName);
        if (foundClass) {
          setSelectedClass(foundClass);
          setFilteredStudents(getStudents(foundClass));
          setStudentId('');
        }
      }
    }
    
    if (surahMatch) setSurah(surahMatch.name);
    if (scoreMatch) setScore(scoreMatch[1]);
    if (notesMatch && notesMatch[2]) {
        const noteStartIndex = lowerTranscript.indexOf(notesMatch[2]);
        setNotes(transcript.substring(noteStartIndex).trim());
    }
    
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 500);
  };

  const toggleListening = () => {
    setSpeechError(''); // Clear previous errors
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const resetForm = () => {
    setStudentId('');
    setSurah('');
    setScore('');
    setNotes('');
    setErrors({});
    setSelectedClass('');
    setFilteredStudents([]);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleInputLagi = () => {
    resetForm();
    setLastSubmission(null);
    setUndoMessage('');
  };

  const handleCorrectData = () => {
    if (!lastSubmission) return;

    deleteLastMurojaahRecord(lastSubmission.studentId);
    
    const student = getStudents().find(s => s.id === lastSubmission.studentId);
    if (student) {
        setSelectedClass(student.class);
        setFilteredStudents(getStudents(student.class));
    }
    setStudentId(String(lastSubmission.studentId));
    setSurah(lastSubmission.surah);
    setScore(String(lastSubmission.score));
    setNotes(lastSubmission.notes || '');
    setDate(lastSubmission.date);

    setLastSubmission(null);
    setUndoMessage('');
  };

  const handleDeleteData = () => {
      if (!lastSubmission) return;
      deleteLastMurojaahRecord(lastSubmission.studentId);
      setUndoMessage('Data terakhir telah dihapus.');
      setTimeout(() => {
          handleInputLagi();
      }, 2000);
  };

  const validate = (): boolean => {
    const newErrors: { selectedClass?: string; studentId?: string; surah?: string; score?: string } = {};
    
    if (!selectedClass) newErrors.selectedClass = 'Kelas harus dipilih.';
    if (!studentId) newErrors.studentId = 'Siswa harus dipilih.';
    if (!surah) newErrors.surah = 'Surat harus dipilih.';

    const scoreNum = Number(score);
    if (!score) {
        newErrors.score = 'Nilai tidak boleh kosong.';
    } else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        newErrors.score = 'Nilai harus berupa angka antara 0 dan 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const studentIdNum = Number(studentId);
    addMurojaahRecord(studentIdNum, {
      date,
      surah,
      score: Number(score),
      notes,
    });
    
    const student = getStudents().find(s => s.id === studentIdNum);
    setLastSubmission({
      studentId: studentIdNum,
      studentName: student?.name || 'Siswa',
      surah,
      score: Number(score),
      notes,
      date,
    });
  };

  if (lastSubmission) {
    return (
        <div className="animate-fade-in text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
                Data Berhasil Disimpan!
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-lg text-left space-y-3">
                <div className="flex justify-between items-center"><span className="font-semibold text-gray-400">Tanggal:</span> <span className="font-medium text-white">{new Date(lastSubmission.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-gray-400">Nama Siswa:</span> <span className="font-medium text-white">{lastSubmission.studentName}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-gray-400">Surat:</span> <span className="font-medium text-white">{lastSubmission.surah}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-gray-400">Nilai:</span> <span className="font-medium text-white">{lastSubmission.score}</span></div>
                {lastSubmission.notes && <div className="pt-2 border-t border-dark-glass-border"><p className="font-semibold text-gray-400 mb-1">Catatan:</p><p className="text-gray-200 whitespace-pre-wrap">{lastSubmission.notes}</p></div>}
            </div>
            
            {undoMessage ? (
                <div className="mt-8 text-lg font-medium text-yellow-400 animate-fade-in">{undoMessage}</div>
            ) : (
              <>
                <Button onClick={handleInputLagi} className="mt-8">
                    Input Data Baru
                </Button>
                <div className="mt-4 text-sm text-gray-400">
                    Salah input?
                    <button onClick={handleCorrectData} className="text-brand-accent hover:underline font-medium ml-2 px-2 py-1 transition-colors">
                        Koreksi Data
                    </button>
                    atau
                    <button onClick={handleDeleteData} className="text-red-400 hover:underline font-medium ml-1 px-2 py-1 transition-colors">
                        Hapus Data
                    </button>
                </div>
              </>
            )}
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Pilih Kelas">
                <Select value={selectedClass} onChange={handleClassChange} required>
                    <option value="">Pilih Kelas</option>
                    {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </Select>
                {errors.selectedClass && <ErrorMessage>{errors.selectedClass}</ErrorMessage>}
            </FormGroup>

            <FormGroup label="Nama Siswa">
                <Select value={studentId} onChange={(e) => setStudentId(e.target.value)} required disabled={!selectedClass}>
                    <option value="">{selectedClass ? 'Pilih Siswa' : 'Pilih kelas terlebih dahulu'}</option>
                    {filteredStudents.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                </Select>
                {errors.studentId && <ErrorMessage>{errors.studentId}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup label="Tanggal">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </FormGroup>

            <FormGroup label="Pilih Surat">
                <Select value={surah} onChange={(e) => setSurah(e.target.value)} required>
                    <option value="">Pilih Surat</option>
                    {SURAHS.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                </Select>
                {errors.surah && <ErrorMessage>{errors.surah}</ErrorMessage>}
            </FormGroup>
            
            <div className="md:col-span-2">
              <FormGroup label="Nilai (0-100)">
                  <Input type="number" min="0" max="100" placeholder="Contoh: 85" value={score} onChange={(e) => setScore(e.target.value)} required />
                  {errors.score && <ErrorMessage>{errors.score}</ErrorMessage>}
              </FormGroup>
            </div>
        </div>

        <FormGroup label="Catatan Guru">
            <TextArea rows={4} placeholder="Catatan mengenai kelancaran, tajwid, makhraj, dll." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormGroup>
        
        <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button type="submit">
                    SIMPAN MUROJAAH
                </Button>
                <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-end transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed ${
                    isListening
                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                        : 'bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent/20'
                    }`}
                >
                    <Icon name="microphone" className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                    <span>{isListening ? 'Mendengarkan...' : 'Isi dengan Suara'}</span>
                </button>
            </div>
            {speechError && <ErrorMessage>{speechError}</ErrorMessage>}
        </div>
    </form>
  );
};

export default MurojaahForm;
