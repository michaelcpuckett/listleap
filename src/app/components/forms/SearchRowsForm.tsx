import { AutoSaveSearchElement } from 'components/elements/AutoSaveSearchElement';
import { ButtonElement } from 'components/elements/ButtonElement';
import { ClearSearchElement } from 'components/elements/ClearSearchElement';
import React from 'react';

export function SearchRowsForm(
  props: React.PropsWithoutRef<{ url: string; query: Record<string, string> }>,
) {
  const queryUrl = new URL(props.url);
  const searchParams = new URLSearchParams(queryUrl.search);
  searchParams.delete('query');
  const searchParamEntries = Array.from(searchParams.entries());

  return (
    <form
      action={queryUrl.pathname}
      method="GET"
      role="none"
    >
      {searchParamEntries.map(([key, value]) => (
        <input
          key={key}
          type="hidden"
          name={key}
          value={value}
        />
      ))}
      <div style={{ display: 'flex', flex: 1 }}>
        <AutoSaveSearchElement
          id="search-rows-input"
          name="query"
          label="Search"
          value={props.query.query ?? ''}
          placeholder="Search rows"
        />
        <ClearSearchElement />
      </div>
      <button
        type="submit"
        hidden
      >
        Search
      </button>
      <noscript>
        <ButtonElement>Search</ButtonElement>
      </noscript>
    </form>
  );
}
