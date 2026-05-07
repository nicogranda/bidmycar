import React from "react";
import "./EditorCommandButton.css";

const ICONS = {
  bold: <strong>B</strong>,
  italic: <em>I</em>,
  underline: <u>U</u>,

  h2: <strong>H2</strong>,
  h3: <strong>H3</strong>,
  h4: <strong>H4</strong>,
  h5: <strong>H5</strong>,
  h6: <strong>H6</strong>,

  paragraph: <strong>P</strong>,

  alignLeft: (
    <svg viewBox="0 0 24 24">
      <path d="M3 4h18v2H3V4zm0 5h12v2H3V9zm0 5h18v2H3v-2zm0 5h12v2H3v-2z" />
    </svg>
  ),

  alignCenter: (
    <svg viewBox="0 0 24 24">
      <path d="M3 4h18v2H3V4zm3 5h12v2H6V9zm-3 5h18v2H3v-2zm3 5h12v2H6v-2z" />
    </svg>
  ),

  alignRight: (
    <svg viewBox="0 0 24 24">
      <path d="M3 4h18v2H3V4zm6 5h12v2H9V9zm-6 5h18v2H3v-2zm6 5h12v2H9v-2z" />
    </svg>
  ),

  unorderedList: (
    <svg viewBox="0 0 24 24">
      <path d="M4 6h2v2H4V6zm0 6h2v2H4v-2zm0 6h2v2H4v-2zM8 6h12v2H8V6zm0 6h12v2H8v-2zm0 6h12v2H8v-2z" />
    </svg>
  ),

  orderedList: (
    <svg viewBox="0 0 24 24">
      <path d="M7 6h14v2H7V6zm0 6h14v2H7v-2zm0 6h14v2H7v-2zM3 7h2v2H3V7zm0 6h2v2H3v-2zm0 6h2v2H3v-2z" />
    </svg>
  ),

  image: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 17l-5-6-4 5-3-3-6 7h18z" />
    </svg>
  ),

  video: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polygon points="10,9 16,12 10,15" />
    </svg>
  ),

  link: (
    <svg viewBox="0 0 24 24">
      <path d="M3.9 12a5 5 0 015-5h3v2h-3a3 3 0 100 6h3v2h-3a5 5 0 01-5-5zm12-3h-3v-2h3a5 5 0 110 10h-3v-2h3a3 3 0 100-6z" />
    </svg>
  )
};

export default function EditorCommandButton({ type, title, onClick }) {
  return (
    <button
      type="button"
      className="editor-command-btn"
      title={title}
      onClick={onClick}
    >
      {ICONS[type]}
    </button>
  );
}
