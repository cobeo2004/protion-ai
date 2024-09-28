"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import React from "react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const othersPresence = useOthers();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const cursor = {
      x: Math.floor(e.pageX),
      y: Math.floor(e.pageY),
    };
    updateMyPresence({
      cursor,
    });
  };

  const handlePointerLeave = () => {
    updateMyPresence({
      cursor: null,
    });
  };

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {othersPresence
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            x={presence.cursor?.x}
            y={presence.cursor?.y}
            info={info}
          />
        ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider;
