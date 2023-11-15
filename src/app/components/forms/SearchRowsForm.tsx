import React from 'react';
import { Referrer } from 'shared/types';
import { AutoSaveSearchElement } from 'components/elements/AutoSaveSearchElement';
import { ClearSearchElement } from 'components/elements/ClearSearchElement';

export function SearchRowsForm(
  props: React.PropsWithoutRef<{ referrer: Referrer }>,
) {
  const referrerUrl = new URL(props.referrer.url);
  const searchParams = new URLSearchParams(referrerUrl.search);
  searchParams.delete('query');
  const searchParamEntries = Array.from(searchParams.entries());

  return (
    <details open={referrerUrl.searchParams.has('query')}>
      <summary className="button">Search</summary>
      <form
        action={referrerUrl.pathname}
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
        <AutoSaveSearchElement
          id="search-rows-input"
          name="query"
          label="Search"
          value={props.referrer.query ?? ''}
        />
        <button
          className="button"
          type="submit"
        >
          Search
        </button>
        <ClearSearchElement />
      </form>
    </details>
  );
}
