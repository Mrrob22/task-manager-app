import Modal from './Modal';

export default function ConfirmModal({
                                       open, onClose, title = 'Confirm', text = 'Are you sure?', onConfirm,
                                     }: {
  open: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm mb-4">{text}</p>
      <div className="flex justify-end gap-2">
        <button type="button" className="px-3 py-1 rounded-md border" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded-md bg-red-600 text-white"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
