import { useCallback, useEffect, useState } from 'react';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('counterDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        return;
      }

      const db = event.target.result;

      if (!db.objectStoreNames.contains('counters')) {
        db.createObjectStore('counters', { keyPath: 'id' });
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
async function setCounter(value: number) {
  const db = await openDB();
  const transaction = db.transaction('counters', 'readwrite');
  const store = transaction.objectStore('counters');
  store.put({ id: 'homeCounter', value });

  return transaction.oncomplete;
}

// Function to get the counter
export async function getCounter(): Promise<number> {
  const db = await openDB();
  const transaction = db.transaction('counters', 'readonly');
  const store = transaction.objectStore('counters');
  const request = store.get('homeCounter');

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.value || 0);
    request.onerror = () => reject(request.error);
  });
}

export default function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prevCount) => prevCount - 1);
  }, []);

  useEffect(() => {
    setCounter(count);
  }, [count]);

  return (
    <>
      <p>
        <output>{count}</output>
      </p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </>
  );
}
