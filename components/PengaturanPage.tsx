import React, { useState, useRef } from 'react';
import { exportAllData, importAllData, saveLogo, resetLogo } from '../data/dataService';
import { Button, ErrorMessage, SuccessMessage } from './FormCard';
import Icon from './Icon';
import ImportConfirmationModal from './ImportConfirmationModal';
import Logo from './Logo';

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const PengaturanPage: React.FC = () => {
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [fileToImport, setFileToImport] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const showFeedback = (message: string, type: 'success' | 'error') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 5000);
    };

    const handleExport = () => {
        const result = exportAllData();
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `tqa_madiun_backup_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showFeedback('Data berhasil diekspor!', 'success');
        } else {
            showFeedback(result.message || 'Gagal mengekspor data.', 'error');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFileContent(e.target?.result as string);
                    setFileToImport(file);
                    setFeedback(null);
                };
                reader.readAsText(file);
            } else {
                showFeedback('Harap pilih file dengan format .json', 'error');
                setFileToImport(null);
                setFileContent('');
            }
        }
    };

    const handleTriggerImport = () => {
        if (fileToImport && fileContent) {
            setIsConfirmModalOpen(true);
        } else {
            showFeedback('Pilih file untuk diimpor terlebih dahulu.', 'error');
        }
    };

    const handleConfirmImport = () => {
        setIsConfirmModalOpen(false);
        const result = importAllData(fileContent);
        showFeedback(result.message, result.success ? 'success' : 'error');
        if (result.success) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };
    
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };
    
    const handleChooseLogoFile = () => {
        logoInputRef.current?.click();
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 500) { // 500KB limit
                showFeedback('Ukuran file logo terlalu besar. Maksimal 500KB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                saveLogo(reader.result as string);
                window.dispatchEvent(new CustomEvent('logo-updated')); // Notify other components
                showFeedback('Logo berhasil diperbarui!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleResetLogo = () => {
        resetLogo();
        window.dispatchEvent(new CustomEvent('logo-updated'));
        showFeedback('Logo kustom telah dihapus.', 'success');
    };


    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Pengaturan & Manajemen Data</h2>
                    <p className="text-gray-400">Atur logo, ekspor data, atau impor data untuk memulihkan.</p>
                </div>
                
                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-white">Logo Aplikasi</h3>
                    <p className="text-gray-300 mb-6">
                        Ganti logo yang ditampilkan di seluruh aplikasi. Disarankan menggunakan gambar rasio 1:1 (persegi) dengan format PNG/JPG/WEBP.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                            <Logo className="w-full h-full" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                           <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                ref={logoInputRef}
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                            <Button type="button" onClick={handleChooseLogoFile} className="!w-full sm:!w-auto">
                                <Icon name="upload" className="w-5 h-5 mr-2" />
                                Ubah Logo
                            </Button>
                            <button
                                onClick={handleResetLogo}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-red-500/50 text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                            >
                                <Icon name="trash" className="w-5 h-5" />
                                Hapus Logo Kustom
                            </button>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Export Card */}
                    <GlassCard>
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                           <Icon name="download" className="w-6 h-6" />
                            Ekspor Data (Backup)
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Simpan semua data aplikasi (profil siswa, riwayat, logo, dll.) ke dalam satu file JSON.
                            Simpan file ini di tempat yang aman sebagai cadangan.
                        </p>
                        <Button onClick={handleExport}>
                            EKSPOR SEMUA DATA
                        </Button>
                    </GlassCard>

                    {/* Import Card */}
                    <GlassCard>
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                           <Icon name="upload" className="w-6 h-6" />
                           Impor Data (Restore)
                        </h3>
                        <div className="bg-red-500/10 text-red-300 p-3 rounded-md text-sm font-medium mb-6">
                           <strong>Peringatan:</strong> Mengimpor data akan menimpa semua data yang ada saat ini.
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button type="button" onClick={handleChooseFile} className="!w-auto bg-transparent border border-gray-600 !text-gray-300 hover:!bg-gray-700 hover:!text-white">
                                Pilih File...
                            </Button>
                            <span className="text-gray-400 truncate flex-1">{fileToImport ? fileToImport.name : "Belum ada file dipilih"}</span>
                        </div>
                        
                        <Button 
                            onClick={handleTriggerImport} 
                            disabled={!fileToImport} 
                            className="w-full mt-6 !bg-yellow-600 hover:!bg-yellow-700"
                        >
                            IMPOR DATA DARI FILE
                        </Button>
                    </GlassCard>
                </div>
                
                {feedback && (
                    <div className="mt-4 max-w-lg mx-auto">
                        {feedback.type === 'success' ? (
                            <SuccessMessage>{feedback.message}</SuccessMessage>
                        ) : (
                            <ErrorMessage>{feedback.message}</ErrorMessage>
                        )}
                    </div>
                )}
            </div>
            
            <ImportConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmImport}
                fileName={fileToImport?.name || ''}
            />
        </>
    );
};

export default PengaturanPage;
