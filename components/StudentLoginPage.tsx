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
  
  useEffect(() => {
    setClasses(getClasses());
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSelectedStudentId('');
    if (newClass) {
        setStudents(getStudents(newClass));
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md animate-fade-in relative">
         <button
            onClick={onBack}
            className="absolute -top-16 left-0 md:top-4 md:left-4 bg-card dark:bg-dark-card border border-border dark:border-dark-border text-slate-600 dark:text-slate-300 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
            aria-label="Kembali"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div className="text-center mb-8">
            <Logo className="w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Login Siswa</h1>
            <p className="text-slate-600 dark:text-gray-300 mt-1 font-medium">Lihat Progres Hafalanmu</p>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
                <FormGroup label="Pilih Kelas Kamu">
                    <Select value={selectedClass} onChange={handleClassChange} required>
                        <option value="">Pilih Kelas</option>
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </Select>
                </FormGroup>
                
                <FormGroup label="Pilih Nama Kamu">
                    <Select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required disabled={!selectedClass}>
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