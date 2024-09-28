"use client";

import React from "react";
import {
  ClientSideSuspense,
  RoomProvider as LiveBlocksRoomProvider,
} from "@liveblocks/react/suspense";
import LiveCursorProvider from "./LiveCursorProvider";
function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <LiveBlocksRoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </LiveBlocksRoomProvider>
  );
}

export default RoomProvider;
