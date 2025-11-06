import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">{title}</h2>
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-6 md:p-8 shadow-sm">
            {children}
        </div>
    </div>
  );
};

export const FormGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-6">
        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">{label}</label>
        {children}
    </div>
);

const baseInputClasses = "w-full bg-input dark:bg-dark-input border border-border dark:border-dark-border rounded-lg py-2.5 px-4 text-slate-900 dark:text-slate-100 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500";

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`${baseInputClasses} ${props.className}`}>
        {props.children}
    </select>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`${baseInputClasses} ${props.className}`} />
);

// FIX: Wrap TextArea with React.forwardRef to allow passing a ref to the underlying textarea element. This resolves an error where a ref was passed to a functional component that could not accept it.
export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
  <textarea {...props} ref={ref} className={`${baseInputClasses} ${props.className}`} />
));
TextArea.displayName = 'TextArea';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <button {...props} className={`w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-background transition-all duration-300 hover:shadow-glow-accent disabled:opacity-75 disabled:cursor-not-allowed disabled:shadow-none ${props.className}`}>
        {props.children}
    </button>
);

export const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 animate-fade-in">{children}</p>
);

export const SuccessMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md text-center text-sm font-medium animate-fade-in border border-green-200 dark:border-green-500/30">
        {children}
    </div>
);

export default FormCard;