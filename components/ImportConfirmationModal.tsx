import React from 'react';

interface ImportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

const ImportConfirmationModal: React.FC<ImportConfirmationModalProps> = ({ isOpen, onClose, onConfirm, fileName }) => {
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
        className="bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-8 w-full max-w-lg mx-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500/20 mb-4">
              <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Konfirmasi Impor Data</h2>
          <p className="text-gray-300 mb-2">
            Anda akan mengimpor data dari file: <strong className="font-medium text-white break-all">"{fileName}"</strong>.
          </p>
          <p className="text-red-400 font-semibold text-lg bg-red-500/10 p-3 rounded-md">
            PERINGATAN: Tindakan ini akan <strong className="font-bold">MENGGANTI SEMUA DATA</strong> yang ada saat ini dengan data dari file. Pastikan Anda telah mengekspor data terbaru jika perlu.
          </p>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-transparent border border-gray-500 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 w-1/2"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition-all duration-200 w-1/2"
          >
            Ya, Impor & Timpa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportConfirmationModal;
