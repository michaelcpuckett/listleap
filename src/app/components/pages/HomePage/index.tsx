import Counter from 'components/elements/Counter';
import Note, { Note as INote } from 'components/elements/Note';
import { useCallback, useState } from 'react';

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export default function HomePage({
  initialNotes,
  initialCount,
}: {
  initialNotes: INote[];
  initialCount: number;
}) {
  const [notes, setNotes] = useState<INote[]>(initialNotes);

  const createNote = useCallback(() => {
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        id: prevNotes.length,
        text: `Note ${prevNotes.length}`,
      },
    ]);
  }, []);

  return (
    <main>
      <h1>Hello world!</h1>
      <Counter initialCount={initialCount} />
      <button onClick={createNote}>Create Note</button>
      <div
        role="grid"
        aria-label="Notes"
      >
        <div role="rowgroup">
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              notes={notes}
              setNotes={setNotes}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
