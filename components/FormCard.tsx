import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
        <div className="bg-dark-glass-bg backdrop-blur-xl border border-dark-glass-border rounded-2xl p-6 md:p-8">
            {children}
        </div>
    </div>
  );
};

export const FormGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">{label}</label>
        {children}
    </div>
);

const baseInputClasses = "w-full bg-dark-glass-bg border border-dark-glass-border rounded-md py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all placeholder:text-gray-400";

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

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <button {...props} className={`w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-end focus:ring-brand-accent transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/40 disabled:opacity-75 disabled:cursor-not-allowed ${props.className}`}>
        {props.children}
    </button>
);

export const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-red-400 text-xs mt-1 animate-fade-in">{children}</p>
);

export const SuccessMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-4 bg-green-500/20 text-green-300 p-3 rounded-md text-center text-sm font-medium animate-fade-in">
        {children}
    </div>
);

export default FormCard;