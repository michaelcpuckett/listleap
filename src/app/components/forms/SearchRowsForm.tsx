import React from 'react';
import {Referrer} from 'shared/types';

export function SearchRowsForm(props: React.PropsWithoutRef<{ referrer: Referrer }>) {
  const referrerUrl = new URL(props.referrer.url);
  const searchParams = new URLSearchParams(referrerUrl.search);
  searchParams.delete('query');
  const searchParamEntries = Array.from(searchParams.entries());
  const actionUrl = new URL(referrerUrl.pathname, referrerUrl.origin);
  actionUrl.search = searchParams.toString();
  
  return (
    <form action={actionUrl.href} method="GET" role="none" data-auto-submit="delay">
      {searchParamEntries.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <input className="input" id="search-rows-input" type="search" name="query" value={props.referrer.query ?? ''} />
      <button className="button" type="submit">
        Search
      </button>
    </form>
  )
}