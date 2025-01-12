import {
  FormEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import MarkdownPreview from '../../../components/MarkdownPreview';
import { Note, getNotes, setNotesDb } from '../../../components/NoteRow';

export const metadata = {
  title: 'Note Detail',
  description: 'The note detail page.',
};

export async function getInitialProps(params: Record<string, string>) {
  const notes = await getNotes();
  const note = notes.find(({ id }) => id === params.id);

  return {
    initialNote: note,
  };
}

export default function NoteDetailPage({ initialNote }: { initialNote: Note }) {
  const [note, setNote] = useState<Note>(initialNote);

  const handleInput = useCallback<FormEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setNote({
        ...note,
        text: event.currentTarget.value,
      });
    },
    [note],
  );

  useEffect(() => {
    (async () => {
      const updatedNotes = Array.from(await getNotes());
      const index = updatedNotes.findIndex(({ id }) => id === note.id);
      updatedNotes[index] = note;
      setNotesDb(updatedNotes);
    })();
  }, [note]);

  return (
    <Fragment>
      <header>
        <h1>Note Detail</h1>
      </header>
      <nav>
        <a
          className="button"
          href="/"
        >
          Back
        </a>
      </nav>
      <main>
        <textarea
          defaultValue={note.text}
          onInput={handleInput}
        />
        <MarkdownPreview value={note.text} />
      </main>
    </Fragment>
  );
}
