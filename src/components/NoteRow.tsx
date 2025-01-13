import { Dispatch, SetStateAction, useCallback } from 'react';
import { deleteNote, getNotes, Note, reorderNote } from 'utils/db';

export default function NoteRow({
  note,
  prevNote,
  nextNote,
  setNotes,
}: {
  note: Note;
  prevNote: Note;
  nextNote: Note;
  setNotes: Dispatch<SetStateAction<Note[]>>;
}) {
  const handleDelete = useCallback(async () => {
    await deleteNote(note).then(async () => {
      const notes = await getNotes();
      setNotes(notes);
    });
  }, [note, setNotes]);

  const handleMoveUp = useCallback(async () => {
    if (!prevNote) {
      return;
    }

    await reorderNote(note, prevNote).then(async () => {
      const notes = await getNotes();
      setNotes(notes);
    });
  }, [note, prevNote, setNotes]);

  const handleMoveDown = useCallback(async () => {
    if (!nextNote) {
      return;
    }

    await reorderNote(note, nextNote).then(async () => {
      const notes = await getNotes();
      setNotes(notes);
    });
  }, [note, nextNote, setNotes]);

  return (
    <div role="row">
      <div role="gridcell">
        <p>{note.text.slice(0, 20)}...</p>
      </div>
      <div role="gridcell">
        <a
          className="button"
          href={`/notes/${note.id}`}
        >
          Edit
        </a>
      </div>
      <div role="gridcell">
        <button
          className="button"
          onClick={handleMoveUp}
          disabled={!prevNote}
        >
          Move Up
        </button>
      </div>
      <div role="gridcell">
        <button
          className="button"
          onClick={handleMoveDown}
          disabled={!nextNote}
        >
          Move Down
        </button>
      </div>
      <div role="gridcell">
        <button
          className="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
