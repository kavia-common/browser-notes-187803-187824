//
// Utility for interacting with localStorage to persist notes
//

const STORAGE_KEY = 'notes_app_items_v1';

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes array from localStorage. Returns [] when none or invalid. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Persist notes array to localStorage safely. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes || []));
  } catch {
    // Fail silently to avoid blocking the UI.
  }
}

// PUBLIC_INTERFACE
export function generateId() {
  /** Generate a unique ID for a note. */
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
