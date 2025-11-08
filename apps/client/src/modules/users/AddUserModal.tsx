import React, { useState } from 'react';
import { createUser, type UserDTO } from '../../services/api';
import Modal from '../../components/Modal';

export default function AddUserModal({
                                       open,
                                       onClose,
                                       onCreated,
                                     }: {
  open: boolean;
  onClose: () => void;
  onCreated: (u: UserDTO) => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', avatarUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Вкажіть імʼя та email');
      return;
    }

    setLoading(true);
    try {
      const u = await createUser(form);
      onCreated(u);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Помилка при створенні користувача');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Додати користувача">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Імʼя</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL (опційно)</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-1"
          />
        </div>

        {error && <div className="text-xs text-red-500">{error}</div>}

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="px-3 py-1 rounded-md border" onClick={onClose}>
            Скасувати
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-3 py-1 rounded-md bg-black text-white"
          >
            {loading ? 'Збереження...' : 'Додати'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
