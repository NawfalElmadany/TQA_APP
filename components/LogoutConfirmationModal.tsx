import React from 'react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-glass-bg dark:bg-dark-glass-bg backdrop-blur-xl border border-glass-border dark:border-dark-glass-border rounded-2xl p-8 w-full max-w-md mx-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Konfirmasi Logout</h2>
          <p className="text-gray-300 mb-8">Apakah Anda yakin ingin keluar dari aplikasi?</p>
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
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
