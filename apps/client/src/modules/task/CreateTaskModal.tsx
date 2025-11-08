import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Priority, UserDTO } from '../../services/api';
import { getPresignedUrl, putToS3 } from '../../services/api';
import { useCreateTask } from './useTasks';
import SelectAssigneeModal from './SelectAssigneeModal';
import { useState } from 'react';
import Modal from '../../components/Modal';

const schema = Yup.object({
  title: Yup.string().required('Назва обовʼязкова'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required(),
  dueDate: Yup.string().optional(),
});

export default function CreateTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createTask = useCreateTask();
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assignee, setAssignee] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Створити задачу">
        <Formik
          initialValues={{
            title: '',
            description: '',
            priority: 'medium' as Priority,
            dueDate: '',
            file: null as File | null,
          }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              let attachment;
              if (values.file) {
                const sign = await getPresignedUrl({
                  filename: values.file.name,
                  type: values.file.type,
                });
                await putToS3(sign.uploadUrl, values.file);
                attachment = {
                  url: sign.fileUrl,
                  key: sign.key,
                  name: values.file.name,
                  size: values.file.size,
                  type: values.file.type,
                };
              }

              await createTask.mutateAsync({
                title: values.title,
                description: values.description || undefined,
                priority: values.priority,
                dueDate: values.dueDate || undefined,
                status: 'todo',
                assignee,
                attachment,
              });

              onClose();
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Назва</label>
                <Field name="title" className="w-full border rounded-md px-2 py-1" />
                <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />
              </div>

              <div>
                <label className="block text-sm mb-1">Опис</label>
                <Field as="textarea" name="description" className="w-full border rounded-md px-2 py-1" />
              </div>

              <div>
                <label className="block text-sm mb-1">Виконавець</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={assignee?.name ?? ''}
                    placeholder="Не обрано"
                    className="w-full border rounded-md px-2 py-1 bg-gray-50"
                  />
                  <button type="button" className="px-2 py-1 rounded-md border" onClick={() => setAssigneeOpen(true)}>
                    Обрати
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Пріоритет</label>
                  <Field as="select" name="priority" className="w-full border rounded-md px-2 py-1">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                </div>
                <div>
                  <label className="block text-sm mb-1">Термін</label>
                  <Field type="date" name="dueDate" className="w-full border rounded-md px-2 py-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Файл</label>
                <input
                  type="file"
                  onChange={(e) => setFieldValue('file', e.currentTarget.files?.[0] ?? null)}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" className="px-3 py-1 rounded-md border" onClick={onClose}>
                  Скасувати
                </button>
                <button disabled={isSubmitting} type="submit" className="px-3 py-1 rounded-md bg-black text-white">
                  Створити
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <SelectAssigneeModal
        open={assigneeOpen}
        onClose={() => setAssigneeOpen(false)}
        onSelect={(u: UserDTO) => {
          setAssignee({ id: u._id, name: u.name });
          setAssigneeOpen(false);
        }}
      />
    </>
  );
}
