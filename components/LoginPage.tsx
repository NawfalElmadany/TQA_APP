


import React, { useState } from 'react';
import { Button, Input } from './FormCard';
import Icon from './Icon';
import Logo from './Logo';
// Import signIn instead of non-existent authenticateUser.
import { signIn } from '../data/dataService';

interface TeacherLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onSelectRegister: () => void;
}

const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({ onLogin, onBack, onSelectRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
        newErrors.email = 'Email tidak boleh kosong.';
    }
    if (!password) {
        newErrors.password = 'Password tidak boleh kosong.';
    }
    return newErrors;
  };

  // FIX: Make handleSubmit async to handle promise from signIn.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    setErrors({});
    setIsLoading(true);
    
    // Use signIn and await the result.
    const { error } = await signIn(email, password);
    
    if (error) {
        setLoginError('Email atau password yang Anda masukkan salah.');
    } else {
        onLogin();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md animate-fade-in relative">
        <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-dark-glass-bg border border-dark-glass-border text-gray-300 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors duration-200"
            aria-label="Kembali"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <div className="text-center mb-8">
            <Logo className="w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-3" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Login Guru</h1>
            <p className="text-gray-300 mt-1 font-medium">TQA APP</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="email" className="w-5 h-5 text-gray-400" />
                    </span>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-accent ${errors.email ? 'border-red-500' : 'border-white/20'}`}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                    />
                </div>
                {errors.email && <p id="email-error" className="text-red-400 text-xs mt-2">{errors.email}</p>}
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="lock" className="w-5 h-5 text-gray-400" />
                    </span>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-accent ${errors.password ? 'border-red-500' : 'border-white/20'}`}
                        required
                        aria-invalid={!!errors.password}
                        aria-describedby="password-error"
                    />
                </div>
                {errors.password && <p id="password-error" className="text-red-400 text-xs mt-2">{errors.password}</p>}
            </div>
            
            {loginError && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-center text-sm font-medium mb-6 animate-fade-in">
                {loginError}
              </div>
            )}

            <div className="mt-8">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-end focus:ring-brand-accent transition-all duration-300 shadow-lg hover:shadow-brand-accent/30 disabled:opacity-75"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Icon name="spinner" className="w-5 h-5 mr-2 animate-spin-slow" />
                            <span>Logging in...</span>
                        </div>
                    ) : (
                        'LOGIN'
                    )}
                </Button>
            </div>
          </form>
           <div className="text-center mt-6 flex justify-between items-center">
              <a href="#" className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200">
                Lupa Password?
              </a>
              <button onClick={onSelectRegister} className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200 font-medium">
                Buat Akun Baru
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginPage;