import React from 'react';
import { PostFormElement } from 'components/elements/PostFormElement';
import { ButtonElement } from 'components/elements/ButtonElement';

export function AddDatabaseForm() {
  return (
    <PostFormElement
      id="new-database"
      action="/databases"
    >
      <input
        name="name"
        aria-label="Name"
        value=""
        className="input"
        id="new-database-name"
      />
      <select
        className="input visually-hidden"
        name="type"
        required
      >
        <option value="TABLE">Table</option>
        {null && (
          <>
            <option value="CHECKLIST">Checklist</option>
            <option value="LIST">List</option>
            <option value="CALENDAR">Calendar</option>
            <option value="BOARD">Board</option>
          </>
        )}
      </select>
      <ButtonElement>Add Database</ButtonElement>
    </PostFormElement>
  );
}
