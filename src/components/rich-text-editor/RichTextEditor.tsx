"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./Editor";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReichTextEditor = ({ field }: { field: any }) => {
  let content;
  try {
    content = field.value ? JSON.parse(field.value) : "<p>Hello World 🚀</p>";
  } catch {
    content = "<p>Hello World 🚀</p>";
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 prose prose-sm sm:prose md:prose-lg lg:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      field.onChange(JSON.stringify(json));
    },
    content,
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-input overflow-hidden w-full rounded-lg dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default ReichTextEditor;
