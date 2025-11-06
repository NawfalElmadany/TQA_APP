import React, { useState } from 'react';
import { Button, Input, SuccessMessage } from './FormCard';
import Icon from './Icon';
import Logo from './Logo';
import { registerUser } from '../data/dataService';

interface RegistrationPageProps {
  onNavigateToLogin: () => void;
  onBack: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onNavigateToLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!password) {
      newErrors.password = 'Password tidak boleh kosong.';
    } else if (password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi password tidak cocok.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    const result = await registerUser(email, password);
    if (result.success) {
      setSuccessMessage('Registrasi berhasil! Anda akan dialihkan ke halaman login.');
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    } else {
      setApiError("Gagal mendaftar. Pengguna mungkin sudah ada.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md animate-fade-in relative">
        <button
            onClick={onBack}
            className="absolute -top-16 left-0 md:top-4 md:left-4 bg-dark-card/50 backdrop-blur-xl border border-brand-accent/20 text-slate-300 p-2.5 rounded-lg hover:bg-dark-card/80 hover:border-brand-accent/40 hover:text-white transition-colors duration-200"
            aria-label="Kembali ke Login"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <div className="text-center mb-8">
            <Logo className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight" style={{ textShadow: '0 0 10px hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l) / 0.5)'}}>Buat Akun Baru</h1>
            <p className="text-slate-300 mt-1 font-medium">TQA App</p>
        </div>

        <div className="bg-dark-card/50 backdrop-blur-2xl border border-brand-accent/20 rounded-2xl p-8 shadow-2xl shadow-brand-accent/10">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
                <label htmlFor="email" className="block text-slate-300 text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Icon name="email" className="w-5 h-5 text-slate-400" />
                    </span>
                    <Input id="email" type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className={`pl-11 bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50 ${errors.email ? '!border-red-500' : ''}`} required />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Icon name="lock" className="w-5 h-5 text-slate-400" />
                    </span>
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)}
                        className={`pl-11 bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50 ${errors.password ? '!border-red-500' : ''}`} required />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password}</p>}
            </div>
            
            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-slate-300 text-sm font-semibold mb-2">Konfirmasi Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Icon name="lock" className="w-5 h-5 text-slate-400" />
                    </span>
                    <Input id="confirmPassword" type="password" placeholder="Ketik ulang password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-11 bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50 ${errors.confirmPassword ? '!border-red-500' : ''}`} required />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-2">{errors.confirmPassword}</p>}
            </div>
            
            {apiError && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-300 p-3 rounded-md text-center text-sm font-medium mb-6 animate-fade-in">
                {apiError}
              </div>
            )}

            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}


            <div className="mt-8">
                <Button type="submit" disabled={isLoading || !!successMessage}
                    className="w-full shadow-glow-accent">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Icon name="spinner" className="w-5 h-5 mr-2 animate-spin-slow" />
                            <span>Mendaftar...</span>
                        </div>
                    ) : (
                        'DAFTAR'
                    )}
                </Button>
            </div>
          </form>
           <div className="text-center mt-6">
              <button onClick={onNavigateToLogin} className="text-sm text-slate-400 hover:text-brand-accent transition-colors duration-200">
                Sudah punya akun? Login
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;