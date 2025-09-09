
import React, { useState, useEffect, useRef } from 'react';
import { FormGroup, Select, Input, TextArea, Button, ErrorMessage } from './FormCard';
import { TARTILI_LEVELS } from '../constants';
import { getStudents, getClasses, addTartiliRecord, graduateStudentTartili, deleteLastTartiliRecord } from '../data/dataService';
import { Student } from '../types';
import Icon from './Icon';

interface LastSubmission {
  studentId: number;
  studentName: string;
  level: string;
  page?: string;
  score: number;
  notes?: string;
  lulus?: boolean;
  date: string;
}

const TartiliForm: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [studentId, setStudentId] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [pageFrom, setPageFrom] = useState<string>('');
  const [pageTo, setPageTo] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ selectedClass?: string; studentId?: string; level?: string; pageFrom?: string; pageTo?: string; score?: string }>({});
  
  const [lastSubmission, setLastSubmission] = useState<LastSubmission | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string>('');
  const [isDrillMode, setIsDrillMode] = useState(false);
  const recognitionRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [undoMessage, setUndoMessage] = useState<string>('');

  useEffect(() => {
    // FIX: Fetch classes asynchronously.
    const fetchClasses = async () => {
        setClasses(await getClasses());
    };
    fetchClasses();
    
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
  
  // FIX: Make handleClassChange async to await getStudents.
  const handleClassChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    if (newClass) {
      setFilteredStudents(await getStudents(newClass));
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

  // FIX: Make handleVoiceResult async to await getStudents.
  const handleVoiceResult = async (transcript: string) => {
    let lowerTranscript = transcript.toLowerCase();
    console.log('Voice Transcript:', lowerTranscript);

    // Normalize number words to digits for better matching
    const numberWords: { [key: string]: string } = {
        'satu': '1', 'dua': '2', 'tiga': '3', 'empat': '4', 'lima': '5', 'enam': '6',
    };
    for (const word in numberWords) {
        lowerTranscript = lowerTranscript.replace(new RegExp(word, 'g'), numberWords[word]);
    }

    // --- Parse All Potential Fields ---
    const allStudents = await getStudents();
    const studentMatch = allStudents.find(s => lowerTranscript.includes(s.name.toLowerCase()));
    const pageRangeMatch = lowerTranscript.match(/(?:halaman|hal)\s+(\d+)\s+(?:sampai|s\.d\.|-)\s+(\d+)/);
    const pageSingleMatch = lowerTranscript.match(/(?:halaman|hal)\s+(\d+)/);
    const scoreMatch = lowerTranscript.match(/nilai\s+(\d+)/);
    const notesMatch = lowerTranscript.match(/catatan(nya)?\s+(.*)/);
    const dateMatch = parseDateFromTranscript(lowerTranscript);
    
    // Improved Tartili level parsing
    const levelMatchRegex = /(?:tartili|jilid)\s+(\d)/;
    const levelRegexResult = lowerTranscript.match(levelMatchRegex);
    let foundLevel = '';
    if (levelRegexResult && levelRegexResult[1]) {
        const levelNumber = levelRegexResult[1];
        const matchedLevel = TARTILI_LEVELS.find(l => l.endsWith(levelNumber));
        if (matchedLevel) {
            foundLevel = matchedLevel;
        }
    }

    // --- State Updates ---
    if (dateMatch) setDate(dateMatch);

    if (studentMatch) {
      const studentClass = studentMatch.class;
      const studentsInThatClass = await getStudents(studentClass);
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
          setFilteredStudents(await getStudents(foundClass));
          setStudentId('');
        }
      }
    }
    
    if (foundLevel) setLevel(foundLevel);

    if (pageRangeMatch) {
        setPageFrom(pageRangeMatch[1]);
        setPageTo(pageRangeMatch[2]);
    } else if (pageSingleMatch) {
        setPageFrom(pageSingleMatch[1]);
        setPageTo(pageSingleMatch[1]);
    }
    
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
    setLevel('');
    setPageFrom('');
    setPageTo('');
    setScore('');
    setNotes('');
    setErrors({});
    setSelectedClass('');
    setFilteredStudents([]);
    setIsDrillMode(false);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleInputLagi = () => {
    resetForm();
    setLastSubmission(null);
    setUndoMessage('');
  };
  
  // FIX: Make handleCorrectData async to await data operations.
  const handleCorrectData = async () => {
    if (!lastSubmission) return;

    await deleteLastTartiliRecord(lastSubmission.studentId);
    
    const allStudents = await getStudents();
    const student = allStudents.find(s => s.id === lastSubmission.studentId);
    if (student) {
        setSelectedClass(student.class);
        setFilteredStudents(await getStudents(student.class));
    }
    setStudentId(String(lastSubmission.studentId));
    setLevel(lastSubmission.level);
    if (lastSubmission.page) {
        const [from, to] = lastSubmission.page.split('-');
        setPageFrom(from);
        setPageTo(to || from);
    } else {
        setPageFrom('');
        setPageTo('');
    }
    setScore(String(lastSubmission.score));
    setNotes(lastSubmission.notes || '');
    setDate(lastSubmission.date);
    setIsDrillMode(!!lastSubmission.lulus);

    setLastSubmission(null);
    setUndoMessage('');
  };

  // FIX: Make handleDeleteData async.
  const handleDeleteData = async () => {
      if (!lastSubmission) return;
      await deleteLastTartiliRecord(lastSubmission.studentId);
      setUndoMessage('Data terakhir telah dihapus.');
      setTimeout(() => {
          handleInputLagi();
      }, 2000);
  };

  const validate = (): boolean => {
    const newErrors: { selectedClass?: string; studentId?: string; level?: string; pageFrom?: string; pageTo?: string; score?: string } = {};

    if (!selectedClass) newErrors.selectedClass = 'Kelas harus dipilih.';
    if (!studentId) newErrors.studentId = 'Siswa harus dipilih.';
    if (!level) newErrors.level = 'Level Tartili harus dipilih.';

    const pageFromNum = Number(pageFrom);
    const pageToNum = Number(pageTo);

    if (!isDrillMode) {
      if (!pageFrom) {
          newErrors.pageFrom = 'Halaman "dari" tidak boleh kosong.';
      } else if (isNaN(pageFromNum) || !Number.isInteger(pageFromNum) || pageFromNum <= 0) {
          newErrors.pageFrom = 'Halaman harus berupa angka bulat positif.';
      }

      if (pageTo && (isNaN(pageToNum) || !Number.isInteger(pageToNum) || pageToNum <= 0)) {
          newErrors.pageTo = 'Halaman "sampai" harus berupa angka bulat positif.';
      } else if (pageTo && pageFrom && pageToNum < pageFromNum) {
          newErrors.pageTo = 'Hal. "sampai" tidak boleh kurang dari hal. "dari".';
      }
    }

    const scoreNum = Number(score);
    if (!score) {
        newErrors.score = 'Nilai tidak boleh kosong.';
    } else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        newErrors.score = 'Nilai harus berupa angka antara 0 dan 100.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FIX: Make handleSubmit async to await data operations.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const pageString = (pageFrom === pageTo || !pageTo) ? pageFrom : `${pageFrom}-${pageTo}`;
    const studentIdNum = Number(studentId);
    
    await addTartiliRecord(studentIdNum, {
      date,
      level,
      page: pageString,
      score: Number(score),
      notes,
    });
    
    const allStudents = await getStudents();
    const student = allStudents.find(s => s.id === studentIdNum);
    setLastSubmission({
        studentId: studentIdNum,
        studentName: student?.name || 'Siswa',
        level,
        page: pageString,
        score: Number(score),
        notes,
        date,
    });
  };

  // FIX: Make handleLulus async to await data operations.
  const handleLulus = async () => {
    const newErrors: { studentId?: string; level?: string; score?: string } = {};
    if (!studentId) newErrors.studentId = 'Siswa harus dipilih untuk menyatakan kelulusan.';
    if (!level) newErrors.level = 'Level Tartili harus dipilih untuk drill.';
    const scoreNum = Number(score);
    if (!score) {
        newErrors.score = 'Nilai drill tidak boleh kosong.';
    } else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        newErrors.score = 'Nilai harus berupa angka antara 0 dan 100.';
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    const studentIdNum = Number(studentId);
    await graduateStudentTartili(studentIdNum, level, Number(score), notes, date);
    
    const allStudents = await getStudents();
    const student = allStudents.find(s => s.id === studentIdNum);
    setLastSubmission({
        studentId: studentIdNum,
        studentName: student?.name || 'Siswa',
        level,
        score: Number(score),
        notes,
        lulus: true,
        date,
    });
    setIsDrillMode(false);
  };

  if (lastSubmission) {
    return (
        <div className="animate-fade-in text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                {lastSubmission.lulus ? `Kelulusan Berhasil Dicatat!` : `Data Berhasil Disimpan!`}
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg text-left space-y-3 border border-border dark:border-dark-border">
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-500 dark:text-slate-400">Tanggal:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(lastSubmission.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-500 dark:text-slate-400">Nama Siswa:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{lastSubmission.studentName}</span></div>
                <div className="flex justify-between items-center"><span className="font-semibold text-slate-500 dark:text-slate-400">Level Tartili:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{lastSubmission.level}</span></div>
                {lastSubmission.page !== undefined && !lastSubmission.lulus && (
                    <div className="flex justify-between items-center"><span className="font-semibold text-slate-500 dark:text-slate-400">Halaman:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{lastSubmission.page}</span></div>
                )}
                 <div className="flex justify-between items-center"><span className="font-semibold text-slate-500 dark:text-slate-400">{lastSubmission.lulus ? `Nilai Drill:` : `Nilai:`}</span> <span className="font-medium text-slate-800 dark:text-slate-200">{lastSubmission.score}</span></div>
                {lastSubmission.notes && <div className="pt-2 border-t border-border dark:border-dark-border"><p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">Catatan:</p><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{lastSubmission.notes}</p></div>}
            </div>
            
            {undoMessage ? (
                <div className="mt-8 text-lg font-medium text-yellow-600 dark:text-yellow-400 animate-fade-in">{undoMessage}</div>
            ) : (
              <>
                <Button onClick={handleInputLagi} className="mt-8">
                    Input Data Baru
                </Button>
                <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Salah input?
                    <button onClick={handleCorrectData} className="text-brand-accent hover:underline font-medium ml-2 px-2 py-1 transition-colors">
                        Koreksi Data
                    </button>
                    atau
                    <button onClick={handleDeleteData} className="text-red-500 dark:text-red-400 hover:underline font-medium ml-1 px-2 py-1 transition-colors">
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
      <style>{`
          .toggle-checkbox:checked + .toggle-label {
              background-color: hsl(var(--color-accent-h), var(--color-accent-s), var(--color-accent-l));
          }
          .toggle-checkbox:checked {
            transform: translateX(1rem);
            border-color: hsl(var(--color-accent-h), var(--color-accent-s), var(--color-accent-l));
          }
          .toggle-checkbox {
            transition: transform .2s ease-in-out;
          }
          .toggle-label {
              transition: background-color .2s ease-in-out;
          }
      `}</style>
      <div className="flex items-center justify-end mb-4">
          <label htmlFor="drill-toggle" className="mr-3 text-sm font-medium text-slate-600 dark:text-slate-300">Mode Drill/Ujian</label>
          <div className="relative inline-block w-10 align-middle select-none">
              <input 
                  type="checkbox" 
                  name="drill-toggle" 
                  id="drill-toggle" 
                  checked={isDrillMode}
                  onChange={() => setIsDrillMode(!isDrillMode)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer border-slate-300 dark:border-slate-500 dark:bg-slate-800"
              />
              <label htmlFor="drill-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-slate-700 cursor-pointer"></label>
          </div>
      </div>

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
          
          <FormGroup label="Tartili">
              <Select value={level} onChange={(e) => setLevel(e.target.value)} required>
                  <option value="">Pilih Level Tartili</option>
                  {TARTILI_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
              </Select>
              {errors.level && <ErrorMessage>{errors.level}</ErrorMessage>}
          </FormGroup>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormGroup label="Halaman">
                <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Dari" value={pageFrom} onChange={(e) => setPageFrom(e.target.value)} required disabled={isDrillMode} />
                    <Input type="number" placeholder="Sampai (Ops.)" value={pageTo} onChange={(e) => setPageTo(e.target.value)} disabled={isDrillMode} />
                </div>
                {errors.pageFrom && <ErrorMessage>{errors.pageFrom}</ErrorMessage>}
                {errors.pageTo && <ErrorMessage>{errors.pageTo}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup label={isDrillMode ? "Nilai Drill (0-100)" : "Nilai (0-100)"}>
                <Input type="number" min="0" max="100" placeholder="Contoh: 90" value={score} onChange={(e) => setScore(e.target.value)} required />
                {errors.score && <ErrorMessage>{errors.score}</ErrorMessage>}
            </FormGroup>
          </div>
      </div>

      <FormGroup label="Catatan Guru">
          <TextArea rows={4} placeholder="Tulis catatan atau feedback untuk siswa..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </FormGroup>
      
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button type="submit" disabled={isDrillMode}>
                SIMPAN CATATAN
            </Button>
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-card transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent/10'
              }`}
            >
              <Icon name="microphone" className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              <span>{isListening ? 'Mendengarkan...' : 'Isi dengan Suara'}</span>
            </button>
        </div>
        
        {isDrillMode && (
            <Button 
                type="button" 
                onClick={handleLulus} 
                className="w-full !bg-green-600 hover:!bg-green-700 focus:!ring-green-500"
            >
                NYATAKAN LULUS
            </Button>
        )}
        {speechError && <ErrorMessage>{speechError}</ErrorMessage>}
      </div>
    </form>
  );
};

export default TartiliForm;
