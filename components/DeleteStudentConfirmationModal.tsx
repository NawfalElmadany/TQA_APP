import React from 'react';

interface DeleteStudentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}

const DeleteStudentConfirmationModal: React.FC<DeleteStudentConfirmationModalProps> = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-xl p-8 w-full max-w-md mx-4 text-slate-800 dark:text-slate-200 shadow-lg border border-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Konfirmasi Hapus</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Apakah Anda yakin ingin menghapus siswa <strong className="font-medium text-slate-800 dark:text-slate-100">"{studentName}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 w-1/2"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card dark:focus:ring-offset-dark-card focus:ring-red-500 transition-all duration-200 w-1/2"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentConfirmationModal;