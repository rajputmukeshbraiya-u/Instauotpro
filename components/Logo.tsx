
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-2 font-bold tracking-tight italic ${sizes[size]}`}>
      <div className="w-8 h-8 rounded-xl instagram-gradient flex items-center justify-center text-white shadow-lg overflow-hidden">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-2.5a1 1 0 110 2 1 1 0 010-2z" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
        InstaOut Pro
      </span>
    </div>
  );
};
