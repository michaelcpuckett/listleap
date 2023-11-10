import React from 'react';

export function AddDatabaseForm() {
  return (
    <form action="/databases" method="POST" role="none">
      <input type="hidden" name="_method" value="POST" />
      <input className="input" type="text" name="name" placeholder="Name" required />
      <select className="input" name="type" required>
        <option value="CHECKLIST">Checklist</option>
        <option value="TABLE">Table</option>
        <option value="LIST">List</option>
        <option value="CALENDAR">Calendar</option>
        <option value="BOARD">Board</option>
      </select>
      <button
        type="submit"
        className="button">
        Add Database
      </button>
    </form>
  );
}
