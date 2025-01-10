import NoteRow, { getNotes, Note, setNotesDb } from 'components/elements/Note';
import { useCallback, useState } from 'react';

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export default function HomePage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const createNote = useCallback(async () => {
    const updatedNotes = Array.from(await getNotes());
    updatedNotes.push({
      id: updatedNotes.length,
      text: `Note ${updatedNotes.length}`,
    });

    setNotes(updatedNotes);
    setNotesDb(updatedNotes);
  }, [notes, setNotes]);

  return (
    <main>
      <h1>Notes</h1>
      <button onClick={createNote}>Create Note</button>
      <div
        role="grid"
        aria-label="Notes"
      >
        <div role="rowgroup">
          {notes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
