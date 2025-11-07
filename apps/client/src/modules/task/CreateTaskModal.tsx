import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Priority } from '../../services/api';
import { getPresignedUrl, putToS3 } from '../../services/api';
import { useCreateTask } from './useTasks';

const schema = Yup.object({
  title: Yup.string().required('Назва обовʼязкова'),
  priority: Yup.string().oneOf(['low','medium','high']).required(),
  dueDate: Yup.string().optional(),
});

export default function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const createTask = useCreateTask();

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-3">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-4">
        <div className="text-lg font-semibold mb-3">Створити задачу</div>

        <Formik
          initialValues={{
            title: '',
            description: '',
            priority: 'medium' as Priority,
            dueDate: '',
            assignee: null as { id: string; name: string } | null,
            file: null as File | null,
          }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              let attachment: {
                url: string;
                key: string;
                name: string;
                size: number;
                type: string;
              } | undefined;

              if (values.file) {
                const sign = await getPresignedUrl({ filename: values.file.name, type: values.file.type });
                await putToS3(sign.uploadUrl, values.file);
                attachment = {
                  url: sign.fileUrl,   // приватний URL — це ок
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
                assignee: values.assignee || null,
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
                <button type="button" className="px-3 py-1 rounded-md border" onClick={onClose}>Скасувати</button>
                <button disabled={isSubmitting} type="submit" className="px-3 py-1 rounded-md bg-black text-white">
                  Створити
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
