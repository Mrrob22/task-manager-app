import React from 'react';
import { useUsers } from '../users/useUsers';
import type { UserDTO } from '../../services/api';
import AddUserModal from '../users/AddUserModal';
import Modal from '../../components/Modal';

export default function SelectAssigneeModal({
                                              open,
                                              onClose,
                                              onSelect,
                                            }: {
  open: boolean;
  onClose: () => void;
  onSelect: (u: UserDTO) => void;
}) {
  const [q, setQ] = React.useState('');
  const { data = [], refetch, isFetching } = useUsers(q);
  const [openAdd, setOpenAdd] = React.useState(false);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Обрати виконавця">
        <div className="flex gap-2 mb-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Пошук по імені або email"
            className="flex-1 border rounded-md px-2 py-1"
          />
          <button className="px-2 py-1 rounded-md border" onClick={() => setOpenAdd(true)}>
            Додати
          </button>
        </div>

        {isFetching ? (
          <div className="py-6 text-center opacity-70">Завантаження…</div>
        ) : data.length === 0 ? (
          <div className="py-6 text-center opacity-70">Нічого не знайдено</div>
        ) : (
          <ul className="divide-y">
            {data.map((u) => (
              <li key={u._id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs opacity-70">{u.email}</div>
                </div>
                <button
                  className="px-2 py-1 rounded-md border"
                  onClick={() => {
                    onSelect(u);
                    onClose();
                  }}
                >
                  Обрати
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={(u) => {
          refetch();
          setOpenAdd(false);
          onSelect(u);
        }}
      />
    </>
  );
}
