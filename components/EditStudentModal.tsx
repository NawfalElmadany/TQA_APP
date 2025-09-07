import React, { useState, useEffect } from 'react';
import { StudentProfileData } from '../types';
import { FormGroup, Input, Button } from './FormCard';
import Icon from './Icon';
import StudentProfilePicModal from './StudentProfilePicModal';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: StudentProfileData;
  onSave: (updatedData: Partial<StudentProfileData>) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, studentData, onSave }) => {
  const [editedName, setEditedName] = useState('');
  const [editedJoinDate, setEditedJoinDate] = useState('');
  const [editedProfilePic, setEditedProfilePic] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  useEffect(() => {
    if (studentData) {
      setEditedName(studentData.name);
      setEditedJoinDate(studentData.joinDate);
      setEditedProfilePic(studentData.profilePic);
    }
  }, [studentData, isOpen]);

  const handleSave = () => {
    onSave({
      name: editedName,
      joinDate: editedJoinDate,
      profilePic: editedProfilePic,
    });
  };

  const handlePhotoTaken = (imageDataUrl: string) => {
    setEditedProfilePic(imageDataUrl);
    setIsTakingPhoto(false);
  };
  
  const defaultAvatar = (
    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
      <Icon name="profil" className="w-12 h-12 text-slate-500 dark:text-slate-400" />
    </div>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ubah Profil Siswa</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">&times;</button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="flex flex-col items-center mb-6">
                  <div className="relative group cursor-pointer" onClick={() => setIsTakingPhoto(true)}>
                      {editedProfilePic ? (
                          <img src={editedProfilePic} alt="Foto Profil" className="w-24 h-24 rounded-full object-cover border-2 border-brand-accent" />
                      ) : (
                          defaultAvatar
                      )}
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ganti foto profil">
                          <Icon name="camera" className="w-8 h-8 text-white" />
                      </div>
                  </div>
              </div>

              <div className="space-y-6">
                  <FormGroup label="Nama Siswa">
                      <Input 
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Nama Lengkap Siswa"
                      />
                  </FormGroup>

                  <FormGroup label="Tanggal Bergabung">
                      <Input 
                          type="date"
                          value={editedJoinDate}
                          onChange={(e) => setEditedJoinDate(e.target.value)}
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
      <StudentProfilePicModal
        isOpen={isTakingPhoto}
        onClose={() => setIsTakingPhoto(false)}
        onSave={handlePhotoTaken}
      />
    </>
  );
};

export default EditStudentModal;