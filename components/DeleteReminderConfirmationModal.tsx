import React from 'react';

interface DeleteReminderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reminderContent: string;
}

const DeleteReminderConfirmationModal: React.FC<DeleteReminderConfirmationModalProps> = ({ isOpen, onClose, onConfirm, reminderContent }) => {
  if (!isOpen) {
    return null;
  }

  const snippet = reminderContent.length > 100 ? `${reminderContent.substring(0, 100)}...` : reminderContent;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-8 w-full max-w-md mx-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Konfirmasi Hapus Pengingat</h2>
          <p className="text-gray-300 mb-8">
            Apakah Anda yakin ingin menghapus pengingat ini?
          </p>
          <blockquote className="text-left bg-slate-800/50 p-4 rounded-lg border-l-4 border-brand-accent mb-8">
            <p className="text-gray-200 italic line-clamp-3">{snippet}</p>
          </blockquote>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-transparent border border-gray-500 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 w-1/2"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-200 w-1/2"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReminderConfirmationModal;
