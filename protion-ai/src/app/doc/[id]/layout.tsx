import { auth } from "@clerk/nextjs/server";
import RoomProvider from "./_components/RoomProvider";
import React from "react";

function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  auth().protect();
  return <RoomProvider roomId={params.id}>{children}</RoomProvider>;
}

export default RoomLayout;
