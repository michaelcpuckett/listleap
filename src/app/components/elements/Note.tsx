import { FormEventHandler, useCallback, useEffect } from 'react';
import MarkdownPreview from './MarkdownPreview';

export interface Note {
  id: number;
  text: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('notesDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        return;
      }

      const db = event.target.result;

      if (!db.objectStoreNames.contains('notes')) {
        const notesObjectStore = db.createObjectStore('notes', {
          keyPath: 'id',
        });
        notesObjectStore.createIndex('id', 'id', { unique: true });
      }
    };

    request.onsuccess = (event: Event) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        reject(new Error('Failed to open the database'));
        return;
      }

      resolve(event.target.result);
    };

    request.onerror = (event) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        reject(new Error('Failed to open the database'));
        return;
      }

      reject(event.target.error);
    };
  });
}

// Function to set the counter
async function setNotesDb(value: Note[]) {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');

  for (const note of value) {
    store.put(note);
  }

  return transaction.oncomplete;
}

// Function to get the counter
export async function getNotes(): Promise<Note[]> {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readonly');
  const store = transaction.objectStore('notes');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export default function Note({
  note,
  notes,
  setNotes,
}: {
  note: Note;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}) {
  const handleInput = useCallback<FormEventHandler<HTMLTextAreaElement>>(
    (event) => {
      const updatedNotes = Array.from(notes);

      const index = updatedNotes.findIndex(({ id }) => note.id === id);

      const target = event.target;

      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }

      updatedNotes[index].text = target.value;

      setNotes(updatedNotes);
    },
    [notes, setNotes],
  );

  useEffect(() => {
    setNotesDb(notes);
  }, [notes]);

  return (
    <div role="row">
      <div role="gridcell">
        <textarea
          onInput={handleInput}
          defaultValue={note.text}
        />
      </div>
      <div role="gridcell">
        <MarkdownPreview value={note.text} />
      </div>
    </div>
  );
}
