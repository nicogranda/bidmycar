import React from "react";
import EditorCommandButton from "./EditorCommandButton";

export default function EditorToolbar({ buttons, commands }) {
  return (
    <div className="toolbar editor-toolbar">
      {buttons.map(btn => (
        <EditorCommandButton
          key={btn.type}
          type={btn.type}
          title={btn.title}
          onClick={commands[btn.action]}
        />
      ))}
    </div>
  );
}
