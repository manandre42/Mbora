
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CarbonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: LucideIcon;
  fullWidth?: boolean;
  loading?: boolean;
}

const CarbonButton: React.FC<CarbonButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  fullWidth = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {Icon && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};

export default CarbonButton;
