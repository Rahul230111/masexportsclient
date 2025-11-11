"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

// dynamically import to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function JoditEditorComponent({
  value,
  onChange,
  placeholder = "Write product description...",
}: {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}) {
  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder,
    height: 300,
    toolbarAdaptive: false,
    toolbarSticky: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "hr",
      "eraser",
      "fullsize",
    ],
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
}
