import NoteRow, { Note, setNotesDb } from 'components/elements/NoteRow';
import { LexoRank } from 'lexorank';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export default function HomePage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const createNote = useCallback(async () => {
    const updatedNotes = Array.from(notes);
    const lastNote = updatedNotes[updatedNotes.length - 1];
    const position = lastNote
      ? LexoRank.parse(lastNote.position).genNext().toString()
      : LexoRank.middle().toString();

    updatedNotes.push({
      id: uuid(),
      position,
      text: '',
    });

    setNotes(updatedNotes);
    setNotesDb(updatedNotes);
  }, [notes, setNotes]);

  const orderedNotes = notes.sort((a, b) => {
    return LexoRank.parse(a.position).compareTo(LexoRank.parse(b.position));
  });

  return (
    <main>
      <h1>Notes</h1>
      <button onClick={createNote}>Create Note</button>
      <div
        role="grid"
        aria-label="Notes"
      >
        <div role="rowgroup">
          {orderedNotes.map((note, index) => (
            <NoteRow
              key={note.id}
              note={note}
              prevNote={orderedNotes[index - 1]}
              nextNote={orderedNotes[index + 1]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
