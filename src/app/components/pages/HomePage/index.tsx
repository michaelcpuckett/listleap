import NoteRow, {
  getNotes,
  Note,
  setNotesDb,
} from 'components/elements/NoteRow';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export default function HomePage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const createNote = useCallback(async () => {
    const updatedNotes = Array.from(await getNotes());
    updatedNotes.push({
      id: uuid(),
      position: '',
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
