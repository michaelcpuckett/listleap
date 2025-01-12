import { LexoRank } from 'lexorank';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import NoteRow, { getNotes, Note, setNotesDb } from '../components/NoteRow';

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export async function getInitialProps(params: Record<string, string>) {
  return {
    initialNotes: await getNotes(),
  };
}

export default function HomePage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const createNote = useCallback(async () => {
    const updatedNotes = Array.from(notes);
    const position =
      notes.length === 0
        ? LexoRank.middle().toString()
        : LexoRank.parse(notes[notes.length - 1].position)
            .genNext()
            .toString();

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
      <button
        className="button"
        onClick={createNote}
      >
        Create Note
      </button>
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
