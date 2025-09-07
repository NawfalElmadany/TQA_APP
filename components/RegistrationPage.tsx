import React, { useState } from 'react';
import { Button, Input, SuccessMessage } from './FormCard';
import Icon from './Icon';
import Logo from './Logo';
import { registerUser } from '../data/dataService';

interface RegistrationPageProps {
  onNavigateToLogin: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onNavigateToLogin }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      const result = registerUser(email, password);
      if (result.success) {
        setSuccessMessage('Registrasi berhasil! Anda akan dialihkan ke halaman login.');
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      } else {
        setApiError(result.message);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
            <Logo className="w-18 h-18 sm:w-24 sm:h-24 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-600 dark:text-gray-300 mt-1 font-medium">TQA App</p>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
                <label htmlFor="email" className="block text-slate-600 dark:text-gray-300 text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="email" className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                    </span>
                    <Input id="email" type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${errors.email ? '!border-red-500' : ''}`} required />
                </div>
                {errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{errors.email}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-slate-600 dark:text-gray-300 text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="lock" className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                    </span>
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 ${errors.password ? '!border-red-500' : ''}`} required />
                </div>
                {errors.password && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{errors.password}</p>}
            </div>
            
            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-slate-600 dark:text-gray-300 text-sm font-semibold mb-2">Konfirmasi Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="lock" className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                    </span>
                    <Input id="confirmPassword" type="password" placeholder="Ketik ulang password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 ${errors.confirmPassword ? '!border-red-500' : ''}`} required />
                </div>
                {errors.confirmPassword && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{errors.confirmPassword}</p>}
            </div>
            
            {apiError && (
              <div className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 p-3 rounded-md text-center text-sm font-medium mb-6 animate-fade-in border border-red-200 dark:border-red-500/30">
                {apiError}
              </div>
            )}

            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}


            <div className="mt-8">
                <Button type="submit" disabled={isLoading || !!successMessage}
                    className="w-full">
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
              <button onClick={onNavigateToLogin} className="text-sm text-slate-500 dark:text-gray-400 hover:text-brand-accent transition-colors duration-200">
                Sudah punya akun? Login
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;