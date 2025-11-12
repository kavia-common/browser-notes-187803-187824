import React from 'react';

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete }) {
  /** Renders a grid list of notes.
   * Props:
   * - notes: array of {id, title, content, createdAt, updatedAt}
   * - onEdit: function(note)
   * - onDelete: function(note)
   */
  if (!notes.length) {
    return (
      <div className="empty">
        <div className="empty-illustration">📝</div>
        <p>No notes yet</p>
        <p className="muted">Click "New Note" to create your first note.</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <article key={note.id} className="note-card">
          <header className="note-card-header">
            <h3 className="note-title">{note.title || 'Untitled'}</h3>
            <div className="note-actions">
              <button className="icon-btn" aria-label="Edit note" onClick={() => onEdit(note)}>✎</button>
              <button className="icon-btn danger" aria-label="Delete note" onClick={() => onDelete(note)}>🗑</button>
            </div>
          </header>
          <p className="note-content">{note.content || 'No content'}</p>
          <footer className="note-meta">
            <span>Updated {new Date(note.updatedAt || note.createdAt).toLocaleString()}</span>
          </footer>
        </article>
      ))}
    </div>
  );
}
