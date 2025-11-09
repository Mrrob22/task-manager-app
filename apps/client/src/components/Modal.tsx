import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  fromRect?: DOMRect | null;
}

export default function Modal({ open, onClose, title, children, className, fromRect }: ModalProps) {
  const container = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.className = 'modal-root';
    return el;
  }, []);

  useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeChild(container);
    };
  }, [container]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!container) return null;

  const initial = fromRect
    ? {
      opacity: 0,
      scale: 0.9,
      x: fromRect.left + fromRect.width / 2 - window.innerWidth / 2,
      y: fromRect.top + fromRect.height / 2 - window.innerHeight / 2,
    }
    : { opacity: 0, scale: 0.92, y: 24 };

  const animate = { opacity: 1, scale: 1, x: 0, y: 0 };
  const exit = { opacity: 0, scale: 0.96, y: 16 };

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={initial}
              animate={animate}
              exit={exit}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg ${className ?? ''}`}
            >
              {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, container);
}
