import React, { useState, useEffect } from 'react';
import { FormGroup, Input, Button, ErrorMessage } from './FormCard';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, className: string) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState<{ name?: string; className?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setName('');
      setClassName('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { name?: string; className?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Nama siswa tidak boleh kosong.';
    }
    if (!className.trim()) {
      newErrors.className = 'Kelas tidak boleh kosong.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(name, className);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
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
          <h2 className="text-2xl font-bold text-white">Tambah Siswa Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl font-light" aria-label="Tutup modal">&times;</button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-6">
                <FormGroup label="Nama Lengkap Siswa">
                    <Input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Ahmad Fauzi"
                        autoFocus
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup label="Kelas">
                    <Input 
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Contoh: 5C"
                    />
                    {errors.className && <ErrorMessage>{errors.className}</ErrorMessage>}
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
                    Simpan Siswa
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
