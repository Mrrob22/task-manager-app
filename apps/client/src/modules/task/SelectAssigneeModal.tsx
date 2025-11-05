import Modal from '../../components/Modal';
import type { Assignee } from '../../types/task';

const mockUsers: Assignee[] = [
  { id: 'u1', name: 'Alice1' },
  { id: 'u2', name: 'Bob1' },
  { id: 'u3', name: 'Mrrob2' }
];

export default function SelectAssigneeModal({
                                              open, onClose, onPick
                                            }: { open: boolean; onClose: () => void; onPick: (a: Assignee) => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Обрати виконавця">
      <div className="flex flex-col gap-2">
        {mockUsers.map(u => (
          <button
            key={u.id}
            className="rounded-xl border bg-white p-3 text-left hover:bg-gray-50"
            onClick={() => { onPick(u); onClose(); }}
          >
            <div className="font-medium">{u.name}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
