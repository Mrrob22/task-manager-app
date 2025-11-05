import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 cursor-pointer bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl ${className ?? ''}`}>
        {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
