import React from 'react';

const symbols = [
  <symbol
    id="x"
    viewBox="0 0 24 24"
  >
    <path
      d="M5 5L19 19M5 19L19 5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </symbol>,
  <symbol
    id="arrow-down"
    viewBox="0 0 96.154 96.154"
  >
    <path
      d="M0.561,20.971l45.951,57.605c0.76,0.951,2.367,0.951,3.127,0l45.956-57.609c0.547-0.689,0.709-1.716,0.414-2.61
c-0.061-0.187-0.129-0.33-0.186-0.437c-0.351-0.65-1.025-1.056-1.765-1.056H2.093c-0.736,0-1.414,0.405-1.762,1.056
c-0.059,0.109-0.127,0.253-0.184,0.426C-0.15,19.251,0.011,20.28,0.561,20.971z"
    />
  </symbol>,
  <symbol
    id="dots-vertical"
    viewBox="0 0 16 16"
  >
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </symbol>,
  <symbol
    id="plus"
    viewBox="125 175 250 250"
  >
    <path d="M 241.99219,407.91016 L 241.99219,310.44922 L 144.72656,310.44922 L 144.72656,294.43359 L 241.99219,294.43359 L 241.99219,197.36328 L 257.61719,197.36328 L 257.61719,294.43359 L 355.27344,294.43359 L 355.27344,310.44922 L 257.61719,310.44922 L 257.61719,407.91016 L 241.99219,407.91016 z" />
  </symbol>,
];

export function Symbols() {
  return (
    <svg
      className="visually-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>{symbols}</defs>
    </svg>
  );
}
