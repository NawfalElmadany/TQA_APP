
import React, { useState, useEffect } from 'react';
import { getStudents, getStudentProfileById, updateStudentProfile, deleteStudent, addStudent, getAllProfiles } from '../data/dataService';
import { Student, StudentProfileData } from '../types';
import Icon from './Icon';
import EditStudentModal from './EditStudentModal';
import AddStudentModal from './AddStudentModal';
import DeleteStudentConfirmationModal from './DeleteStudentConfirmationModal';

interface ProfilPageProps {
  onSelectStudent: (id: number) => void;
}

const StudentCard: React.FC<{ student: Student & { profilePic: string | null }, onSelect: (id: number) => void, onEdit: (student: Student) => void, onDelete: (student: Student) => void }> = ({ student, onSelect, onEdit, onDelete }) => (
    <div 
        className="bg-card dark:bg-dark-card p-4 rounded-lg flex items-center space-x-4 cursor-pointer transition-all duration-300 ease-in-out hover:border-brand-accent hover:shadow-md hover:-translate-y-1 border border-border dark:border-dark-border group relative"
    >
        <div onClick={() => onSelect(student.id)} className="flex items-center space-x-4 flex-grow">
            {student.profilePic ? (
                <img src={student.profilePic} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <div className="w-10 h-10 bg-brand-accent/20 dark:bg-brand-accent/30 text-brand-accent dark:text-brand-accent rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {student.name.charAt(0)}
                </div>
            )}
            <div>
                <h3 className="font-semibold text-md text-slate-800 dark:text-slate-100">{student.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lihat Profile</p>
            </div>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={(e) => { e.stopPropagation(); onEdit(student); }} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full" aria-label={`Ubah ${student.name}`}>
                <Icon name="edit" className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(student); }} className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full" aria-label={`Hapus ${student.name}`}>
                <Icon name="trash" className="w-4 h-4" />
            </button>
        </div>
    </div>
);


const ProfilPage: React.FC<ProfilPageProps> = ({ onSelectStudent }) => {
  const [studentsByClass, setStudentsByClass] = useState<Record<string, (Student & { profilePic: string | null })[]>>({});
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentProfileData | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // FIX: Make fetchStudents async to await data fetching.
  const fetchStudents = async () => {
    const students = await getStudents();
    const profiles = await getAllProfiles();

    const combinedData = students.map(student => {
        const profile = profiles.find(p => p.id === student.id);
        return { ...student, profilePic: profile?.profilePic || null };
    });

    const grouped = combinedData.reduce((acc, student) => {
      const { class: className } = student;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {} as Record<string, (Student & { profilePic: string | null })[]>);

    const sortedGrouped = Object.keys(grouped).sort().reduce(
      (obj, key) => { 
        obj[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name)); 
        return obj;
      }, 
      {} as Record<string, (Student & { profilePic: string | null })[]>
    );

    setStudentsByClass(sortedGrouped);
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  
  const handleClassToggle = (className: string) => {
    setExpandedClass(prev => (prev === className ? null : className));
  };
  
  // FIX: Make handleOpenEditModal async to await getStudentProfileById.
  const handleOpenEditModal = async (student: Student) => {
    const profileData = await getStudentProfileById(student.id);
    if (profileData) {
      setStudentToEdit(profileData);
    }
  };

  // FIX: Make handleSaveStudent async to await updateStudentProfile.
  const handleSaveStudent = async (updatedData: Partial<StudentProfileData>) => {
    if (studentToEdit) {
      await updateStudentProfile(studentToEdit.id, updatedData);
      setStudentToEdit(null);
      fetchStudents();
    }
  };

  // FIX: Make handleConfirmDelete async to await deleteStudent.
  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      fetchStudents();
    }
  };

  // FIX: Make handleAddStudent async to await addStudent.
  const handleAddStudent = async (name: string, className: string) => {
    await addStudent(name, className);
    setIsAddModalOpen(false);
    fetchStudents();
  };

  return (
    <>
      <div className="animate-fade-in space-y-8">
        <div className="flex justify-between items-center pb-5 border-b border-border dark:border-dark-border">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Profil Siswa</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-darker transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-brand-accent/30"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span>Tambah Siswa</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(studentsByClass).map(([className, students]) => {
            const isExpanded = expandedClass === className;
            return (
              <div key={className} className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl transition-all duration-300 overflow-hidden shadow-sm">
                <button
                  onClick={() => handleClassToggle(className)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`class-panel-${className}`}
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{`Kelas ${className}`}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div 
                      id={`class-panel-${className}`}
                      className="p-5 pt-0 animate-fade-in"
                  >
                    <div className="border-t border-border dark:border-dark-border pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {students.map(student => (
                            <StudentCard 
                              key={student.id} 
                              student={student} 
                              onSelect={onSelectStudent} 
                              onEdit={handleOpenEditModal}
                              onDelete={setStudentToDelete}
                            />
                          ))}
                        </div>
                      </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddStudent} 
      />
      
      {studentToEdit && (
        <EditStudentModal 
          isOpen={!!studentToEdit} 
          onClose={() => setStudentToEdit(null)} 
          studentData={studentToEdit}
          onSave={handleSaveStudent} 
        />
      )}

      {studentToDelete && (
        <DeleteStudentConfirmationModal
          isOpen={!!studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onConfirm={handleConfirmDelete}
          studentName={studentToDelete.name}
        />
      )}
    </>
  );
};

export default ProfilPage;
