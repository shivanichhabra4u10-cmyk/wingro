import React from 'react';

interface SegmentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SegmentButton: React.FC<SegmentButtonProps> = ({ active, children, className = '', ...props }) => {
  return (
    <button
      className={`px-6 py-2 rounded-full font-semibold shadow transition-all text-lg
        ${active ? 'bg-cyan-500 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}
        ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default SegmentButton;
