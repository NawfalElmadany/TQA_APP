import React, { useState, useRef } from 'react';
import { exportAllData, importAllData } from '../data/dataService';
import { Button, ErrorMessage, SuccessMessage } from './FormCard';
import Icon from './Icon';
import ImportConfirmationModal from './ImportConfirmationModal';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 md:p-8 shadow-sm ${className}`}>
    {children}
  </div>
);

// FIX: Implement the PengaturanPage component to resolve import errors and syntax errors from an incomplete file.
const PengaturanPage: React.FC = () => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleExport = () => {
    const result = exportAllData();
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TQA_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showFeedback('Data berhasil diekspor!');
    } else {
      showFeedback(result.message || 'Gagal mengekspor data.', 'error');
    }
  };

  const handleImportSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
      setIsImportModalOpen(true);
    } else {
      showFeedback('Harap pilih file JSON yang valid.', 'error');
    }
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!importFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const result = importAllData(content);
        if (result.success) {
          showFeedback(result.message);
          // Reload the application after a short delay to apply changes
          setTimeout(() => window.location.reload(), 2000);
        } else {
          showFeedback(result.message, 'error');
        }
      }
    };
    reader.onerror = () => {
      showFeedback('Gagal membaca file.', 'error');
    };
    reader.readAsText(importFile);
    
    setIsImportModalOpen(false);
    setImportFile(null);
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-border dark:border-dark-border pb-5">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">Pengaturan Aplikasi</h2>
            <p className="text-slate-500 dark:text-slate-400">Kelola data aplikasi.</p>
        </div>

        {feedback && (
          <div className="mb-4">
            {feedback.type === 'success' ? (
              <SuccessMessage>{feedback.message}</SuccessMessage>
            ) : (
              <ErrorMessage>{feedback.message}</ErrorMessage>
            )}
          </div>
        )}

        <div className="max-w-xl">
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Icon name="settings" className="w-6 h-6"/>
                    Manajemen Data
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    Ekspor semua data (siswa, nilai, profil guru, dll.) ke dalam satu file cadangan. Anda dapat mengimpor file ini nanti untuk memulihkan data.
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportSelect}
                    className="hidden"
                    accept="application/json"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" onClick={handleExport} className="w-full !bg-green-600 hover:!bg-green-700 focus:!ring-green-500 flex items-center justify-center gap-2">
                        <Icon name="download" className="w-5 h-5"/>
                        Ekspor Data
                    </Button>
                    <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full !bg-yellow-500 hover:!bg-yellow-600 focus:!ring-yellow-500 flex items-center justify-center gap-2">
                        <Icon name="upload" className="w-5 h-5"/>
                        Impor Data
                    </Button>
                </div>
            </Card>
        </div>
      </div>

      <ImportConfirmationModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleConfirmImport}
        fileName={importFile?.name || ''}
      />
    </>
  );
};

export default PengaturanPage;
