const KEY = 'tm_tasks';

export function saveTasks<T>(tasks: T): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

export function loadTasks<T>(fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn('Failed to load tasks, using fallback:', err);
    return fallback;
  }
}
