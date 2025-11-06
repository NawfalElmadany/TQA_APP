import React, { useState, useEffect } from 'react';
import { Button, Select, FormGroup } from './FormCard';
import Icon from './Icon';
import Logo from './Logo';
import { getClasses, getStudents } from '../data/dataService';
import { Student } from '../types';

interface StudentLoginPageProps {
  onLogin: (studentId: number) => void;
  onBack: () => void;
}

const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ onLogin, onBack }) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // FIX: Fetch classes asynchronously.
  useEffect(() => {
    const fetchClasses = async () => {
        setClasses(await getClasses());
    };
    fetchClasses();
  }, []);

  // FIX: Make handleClassChange async to await getStudents.
  const handleClassChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSelectedStudentId('');
    if (newClass) {
        setStudents(await getStudents(newClass));
    } else {
        setStudents([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentId) {
        onLogin(Number(selectedStudentId));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md animate-fade-in relative">
         <button
            onClick={onBack}
            className="absolute -top-16 left-0 md:top-4 md:left-4 bg-dark-card/50 backdrop-blur-xl border border-brand-accent/20 text-slate-300 p-2.5 rounded-lg hover:bg-dark-card/80 hover:border-brand-accent/40 hover:text-white transition-colors duration-200"
            aria-label="Kembali"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div className="text-center mb-8">
            <Logo className="w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight" style={{ textShadow: '0 0 10px hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l) / 0.5)'}}>Login Siswa</h1>
            <p className="text-slate-300 mt-1 font-medium">Lihat Progres Hafalanmu</p>
        </div>

        <div className="bg-dark-card/50 backdrop-blur-2xl border border-brand-accent/20 rounded-xl p-8 shadow-2xl shadow-brand-accent/10">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
                <FormGroup label="Pilih Kelas Kamu">
                    <Select value={selectedClass} onChange={handleClassChange} required 
                        className="bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50">
                        <option value="">Pilih Kelas</option>
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </Select>
                </FormGroup>
                
                <FormGroup label="Pilih Nama Kamu">
                    <Select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required disabled={!selectedClass}
                        className="bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50">
                        <option value="">{selectedClass ? "Pilih Namamu" : "Pilih kelas dulu ya"}</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </Select>
                </FormGroup>
            </div>

            <div className="mt-8">
                <Button 
                    type="submit" 
                    disabled={!selectedStudentId}
                >
                    MASUK
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;