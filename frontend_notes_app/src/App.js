import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import NotesList from './components/NotesList';
import NoteModal from './components/NoteModal';
import { loadNotes, saveNotes, generateId } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * Notes app single-page UI with:
   * - Header bar
   * - Search
   * - Notes list
   * - Modal for add/edit
   * All data persisted in localStorage.
   */

  // Theme (light only default, preserving existing structure for potential toggle)
  const [theme] = useState('light');

  // Notes and UI state
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const initial = loadNotes();
    setNotes(initial);
  }, []);

  // Persist to localStorage when notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // PUBLIC_INTERFACE
  const openNewModal = () => {
    /** Open modal for creating a new note */
    setEditingNote(null);
    setIsModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const openEditModal = (note) => {
    /** Open modal for editing an existing note */
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const closeModal = () => {
    /** Close note modal */
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // PUBLIC_INTERFACE
  const saveNote = (payload) => {
    /** Create or update a note, then close modal */
    const timestamp = Date.now();

    if (payload.id) {
      // Update existing
      setNotes(prev =>
        prev.map(n => (n.id === payload.id ? { ...n, ...payload, updatedAt: timestamp } : n))
      );
    } else {
      // Create new
      const newNote = {
        id: generateId(),
        title: payload.title || '',
        content: payload.content || '',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setNotes(prev => [newNote, ...prev]);
    }
    closeModal();
  };

  // PUBLIC_INTERFACE
  const deleteNote = (note) => {
    /** Delete a note after confirmation */
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    setNotes(prev => prev.filter(n => n.id !== note.id));
  };

  // Derived: filtered notes by query
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => {
      return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
    });
  }, [notes, query]);

  return (
    <div className="App" data-theme={theme}>
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <div className="brand-logo" aria-hidden>✶</div>
            <div className="brand-text">
              <h1 className="brand-title">Notes</h1>
              <span className="brand-subtitle">Local & Private</span>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <span className="search-icon" aria-hidden>🔎</span>
              <input
                className="search-input"
                type="search"
                placeholder="Search notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search notes"
              />
            </div>
            <button className="btn btn-primary" onClick={openNewModal}>New Note</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <NotesList notes={filteredNotes} onEdit={openEditModal} onDelete={deleteNote} />
        </div>
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveNote}
        initialNote={editingNote}
      />

      <footer className="footer">
        <div className="container footer-inner">
          <span className="muted">
            All notes are stored in your browser using localStorage. No data leaves your device.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
