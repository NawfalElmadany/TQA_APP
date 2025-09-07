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
    <div className="w-24 h-24 rounded-full bg-dark-glass-bg border-2 border-dark-glass-border flex items-center justify-center">
      <Icon name="profil" className="w-12 h-12 text-gray-400" />
    </div>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
        aria-modal="true"
        role="dialog"
        onClick={onClose}
      >
        <div 
          className="bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-8 w-full max-w-lg mx-4 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Ubah Profil Siswa</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
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
                      className="bg-transparent border border-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
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