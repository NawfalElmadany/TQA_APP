import React, { useState } from 'react';
import { Button, Input } from './FormCard';
import Icon from './Icon';
import Logo from './Logo';
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
    
    const { error } = await signIn(email, password);
    
    if (error) {
        setLoginError('Email atau password salah. Silakan coba lagi.');
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
            className="absolute -top-16 left-0 md:top-4 md:left-4 bg-dark-card/50 backdrop-blur-xl border border-brand-accent/20 text-slate-300 p-2.5 rounded-lg hover:bg-dark-card/80 hover:border-brand-accent/40 hover:text-white transition-colors duration-200"
            aria-label="Kembali"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <div className="text-center mb-8">
            <Logo className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight" style={{ textShadow: '0 0 10px hsl(var(--color-accent-h) var(--color-accent-s) var(--color-accent-l) / 0.5)'}}>Login Guru</h1>
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
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-11 bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50 ${errors.email ? '!border-red-500' : ''}`}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                    />
                </div>
                {errors.email && <p id="email-error" className="text-red-400 text-xs mt-2">{errors.email}</p>}
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Icon name="lock" className="w-5 h-5 text-slate-400" />
                    </span>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-11 bg-black/20 border-brand-accent/30 text-white placeholder:text-slate-500 focus:border-brand-accent focus:ring-brand-accent/50 ${errors.password ? '!border-red-500' : ''}`}
                        required
                        aria-invalid={!!errors.password}
                        aria-describedby="password-error"
                    />
                </div>
                {errors.password && <p id="password-error" className="text-red-400 text-xs mt-2">{errors.password}</p>}
            </div>
            
            {loginError && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-300 p-3 rounded-md text-center text-sm font-medium mb-6 animate-fade-in">
                {loginError}
              </div>
            )}

            <div className="mt-8">
                <Button 
                    type="submit" 
                    disabled={isLoading}
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
              <a href="#" className="text-sm text-slate-400 hover:text-brand-accent transition-colors duration-200">
                Lupa Password?
              </a>
              <button onClick={onSelectRegister} className="text-sm text-slate-400 hover:text-brand-accent transition-colors duration-200 font-medium">
                Buat Akun Baru
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginPage;