import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteModal({ isOpen, onClose, onSave, initialNote }) {
  /** A11y-friendly modal for creating or editing a note. 
   * Props:
   * - isOpen: boolean to show/hide modal
   * - onClose: function to close without saving
   * - onSave: function({ id?, title, content }) to save
   * - initialNote: existing note object when editing; undefined/null when adding
   */
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialNote?.title || '');
      setContent(initialNote?.content || '');
      setTimeout(() => titleRef.current?.focus(), 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialNote]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      // Prevent saving completely empty notes
      return;
    }
    const payload = { ...initialNote, title: title.trim(), content: content.trim() };
    onSave(payload);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
      onKeyDown={handleKeyDown}
      ref={dialogRef}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 id="note-modal-title">{initialNote ? 'Edit Note' : 'Add Note'}</h2>
          <button
            className="icon-btn"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSave} className="modal-body">
          <label className="field-label" htmlFor="note-title">Title</label>
          <input
            id="note-title"
            ref={titleRef}
            className="input"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="field-label" htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            className="textarea"
            placeholder="Write your note..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialNote ? 'Save Changes' : 'Add Note'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
