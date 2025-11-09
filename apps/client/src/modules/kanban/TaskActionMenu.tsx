import { useEffect, useRef } from 'react';

export default function TaskActionMenu({
                                         x, y, onEdit, onDelete, onClose,
                                       }: {
  x: number;
  y: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ left: x, top: y }}
      className="fixed z-[60] w-40 rounded-lg border bg-white shadow-lg overflow-hidden"
    >
      <button className="w-full px-3 py-2 text-left hover:bg-zinc-100" onClick={onEdit}>
        Edit
      </button>
      <button className="w-full px-3 py-2 text-left hover:bg-zinc-100 text-red-600" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
