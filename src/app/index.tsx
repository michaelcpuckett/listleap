import { LexoRank } from 'lexorank';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import NoteRow, { getNotes, Note, setNotesDb } from '../components/NoteRow';

function openImagesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('imagesDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        return;
      }

      const db = event.target.result;

      if (!db.objectStoreNames.contains('images')) {
        const notesObjectStore = db.createObjectStore('images', {
          keyPath: 'id',
          autoIncrement: false,
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

async function setImagesDb(images: string[]) {
  const db = await openImagesDB();
  const transaction = db.transaction('images', 'readwrite');
  const store = transaction.objectStore('images');
  const value = images.map((url) => ({ id: url }));

  for (const image of value) {
    store.put(image);
  }

  return transaction.oncomplete;
}

function getImages(): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const db = await openImagesDB();
    const transaction = db.transaction('images', 'readonly');
    const store = transaction.objectStore('images');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result.map((image: any) => image.id));
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export const metadata = {
  title: 'Home',
  description: 'The home page.',
};

export async function getStaticProps(params: Record<string, string>) {
  return {
    initialNotes: await getNotes(),
    initialImages: await getImages(),
  };
}

export default function HomePage({
  initialNotes,
  initialImages,
}: {
  initialNotes: Note[];
  initialImages: string[];
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [images, setImages] = useState<string[]>(initialImages);

  const addNote = useCallback(async () => {
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

  const addFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (event) => {
      const files = event.target.files;

      if (!files || files.length === 0) {
        return;
      }

      const cache = await caches.open('v1');

      await Promise.all(
        Array.from(files).map(async (file) => {
          const url = new URL('/uploads/' + file.name, self.location.origin)
            .href;
          const blob = new Blob([file], { type: file.type });
          const contentLength = blob.size;

          const response = new Response(blob, {
            status: 200,
            headers: {
              'Content-Type': file.type,
              'Content-Length': contentLength.toString(),
              'Last-Modified': new Date().toUTCString(),
            },
          });

          const request = new Request(url);

          await cache.put(request, response);

          setImages((images) => [...images, url]);
        }),
      );
    },
    [notes, setNotes, setImages],
  );

  useEffect(() => {
    setImagesDb(images);
  }, [images]);

  const orderedNotes = notes.sort((a, b) => {
    return LexoRank.parse(a.position).compareTo(LexoRank.parse(b.position));
  });

  return (
    <main>
      <h1>Notes</h1>
      <input
        type="file"
        onChange={addFile}
      />
      <button
        className="button"
        onClick={addNote}
      >
        Add Note
      </button>
      <div
        role="grid"
        aria-label="Todos"
      >
        <div role="rowgroup">
          {orderedNotes.map((note, index) => (
            <NoteRow
              key={note.id}
              note={note}
              prevNote={orderedNotes[index - 1]}
              nextNote={orderedNotes[index + 1]}
              setNotes={setNotes}
            />
          ))}
        </div>
      </div>
      <ul>
        {images.map((image) => (
          <li key={image}>
            <img
              src={image}
              alt=""
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
