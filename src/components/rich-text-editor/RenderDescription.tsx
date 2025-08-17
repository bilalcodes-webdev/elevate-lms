"use client";

import TextAlign from "@tiptap/extension-text-align";
import { type JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import parse from "html-react-parser";

const RenderDescription = ({ json }: { json: JSONContent }) => {
  const output = useMemo(() => {
    if (!json || !json.type) return ""; // safety check

    try {
      return generateHTML(json, [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ]);
    } catch (error) {
      console.error("Error generating HTML from JSON:", error);
      return "";
    }
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
};

export default RenderDescription;
