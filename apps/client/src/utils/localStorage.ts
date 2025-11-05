const KEY = 'tm_tasks';

export function saveTasks(tasks: unknown) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {}
}

export function loadTasks<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
