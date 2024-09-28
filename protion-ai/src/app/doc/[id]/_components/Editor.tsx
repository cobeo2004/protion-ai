"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import TranslateAI from "./TranslateAI";
import AIChatToDoc from "./AIChatToDoc";

type BlockNoteProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: BlockNoteProps) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        className="min-h-screen"
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [yjsProvider, setYjsProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setYjsProvider(yProvider);
    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !yjsProvider) return null;

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* Translate AI */}
        <TranslateAI doc={doc} />
        {/* Chat to doc AI */}
        <AIChatToDoc doc={doc} />
        {/* Dark Mode */}
        <Button onClick={() => setDarkMode(!darkMode)} className={style}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* Block Note */}
      <BlockNote doc={doc} provider={yjsProvider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;
