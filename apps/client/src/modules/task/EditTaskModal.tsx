import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/Modal';
import { useUpdateTask } from './useTasks';
import type { TaskDTO, Priority } from '../../services/api';

const schema = Yup.object({
  title: Yup.string().required(),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required(),
  dueDate: Yup.string().optional(),
});

export default function EditTaskModal({
                                        open, onClose, task, fromRect,
                                      }: { open: boolean; onClose: () => void; task: TaskDTO; fromRect: DOMRect | null }) {
  const updateTask = useUpdateTask();

  return (
    <Modal open={open} onClose={onClose} title="Edit task" fromRect={fromRect}>
      <Formik
        initialValues={{
          title: task.title,
          description: task.description ?? '',
          priority: task.priority as Priority,
          dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
        }}
        validationSchema={schema}
        onSubmit={async (v) => {
          await updateTask.mutateAsync({
            id: task._id,
            data: {
              title: v.title,
              description: v.description || undefined,
              priority: v.priority,
              dueDate: v.dueDate || undefined,
            },
          });
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Field name="title" className="w-full border rounded-md px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Field as="textarea" name="description" className="w-full border rounded-md px-2 py-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Priority</label>
                <Field as="select" name="priority" className="w-full border rounded-md px-2 py-1">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Field>
              </div>
              <div>
                <label className="block text-sm mb-1">Due date</label>
                <Field type="date" name="dueDate" className="w-full border rounded-md px-2 py-1" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-1 rounded-md border" onClick={onClose}>
                Close
              </button>
              <button disabled={isSubmitting} type="submit" className="px-3 py-1 rounded-md bg-black text-white">
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
