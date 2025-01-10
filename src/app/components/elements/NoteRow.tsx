import { FormEvent } from 'react';

export interface Note {
  id: string;
  position: string;
  text: string;
}

export function openDB(): Promise<IDBDatabase> {
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
          autoIncrement: false,
        });
        notesObjectStore.createIndex('id', 'id', { unique: true });
        notesObjectStore.createIndex('position', 'position', { unique: true });
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

export async function setNotesDb(value: Note[]) {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');

  for (const note of value) {
    store.put(note);
  }

  return transaction.oncomplete;
}

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

const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formElement = event.target;

  if (!(formElement instanceof HTMLFormElement)) {
    return;
  }

  await fetch(formElement.action, {
    method: 'DELETE',
  });

  window.location.reload();
};

export default function NoteRow({ note }: { note: Note }) {
  return (
    <div role="row">
      <div role="gridcell">
        <p>{note.text.slice(0, 20)}...</p>
      </div>
      <div role="gridcell">
        <a href={`/notes/${note.id}`}>Edit</a>
      </div>
      <div role="gridcell">
        <form>
          <input
            type="hidden"
            value={note.id}
            name="id"
          />
          <button>Move Up</button>
        </form>
      </div>
      <div role="gridcell">
        <form>
          <input
            type="hidden"
            value={note.id}
            name="id"
          />
          <button>Move Down</button>
        </form>
      </div>
      <div role="gridcell">
        <form
          onSubmit={handleDelete}
          action={'/notes/' + note.id}
        >
          <button>Delete</button>
        </form>
      </div>
    </div>
  );
}
