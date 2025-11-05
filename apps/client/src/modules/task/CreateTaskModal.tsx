import React from 'react';
import Modal from '../../components/Modal';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import type { Priority, Assignee } from '../../types/task';
import SelectAssigneeModal from './SelectAssigneeModal';

const schema = Yup.object({
  title: Yup.string().required('Обовʼязково'),
  description: Yup.string().max(2000),
  priority: Yup.mixed<Priority>().oneOf(['low', 'medium', 'high']).required()
});

export default function CreateTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [assignee, setAssignee] = React.useState<Assignee | undefined>(undefined);
  const [nestedOpen, setNestedOpen] = React.useState(false);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Створити задачу">
        <Formik
          initialValues={{ title: '', description: '', priority: 'medium' as Priority, dueDate: '', file: null as File | null }}
          validationSchema={schema}
          onSubmit={() => { /* позже добавим submit */ }}
        >
          {({ setFieldValue, values }) => (
            <Form className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Назва</span>
                <Field name="title" className="rounded-xl border p-2" placeholder="Нова задача" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Опис</span>
                <Field as="textarea" name="description" className="min-h-24 rounded-xl border p-2" />
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Пріоритет</span>
                  <Field as="select" name="priority" className="rounded-xl border p-2">
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </Field>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Термін</span>
                  <Field type="date" name="dueDate" className="rounded-xl border p-2" />
                </label>

                <div className="flex flex-col gap-1">
                  <span className="text-sm">Виконавець</span>
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded-lg border px-3 py-2 hover:bg-gray-50"
                            onClick={() => setNestedOpen(true)}>
                      Обрати виконавця
                    </button>
                    {assignee ? <span className="text-sm text-gray-700">{assignee.name}</span> :
                      <span className="text-sm text-gray-400">не обрано</span>}
                  </div>
                </div>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Файл</span>
                <input
                  type="file"
                  onChange={(e) => setFieldValue('file', e.currentTarget.files?.[0] ?? null)}
                />
                {values.file && <span className="text-xs text-gray-500">{values.file.name}</span>}
              </label>

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2">Скасувати</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-white">
                  Створити
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <SelectAssigneeModal
        open={nestedOpen}
        onClose={() => setNestedOpen(false)}
        onPick={(a) => setAssignee(a)}
      />
    </>
  );
}
