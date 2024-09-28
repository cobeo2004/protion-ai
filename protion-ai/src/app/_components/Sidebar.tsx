"use client";

import React, { useEffect, useState } from "react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseHelper";
import { DocumentData } from "firebase-admin/firestore";
import SidebarOptions from "./SidebarOptions";

interface RoomDocument extends DocumentData {
  createdAt: string;
  roomId: string;
  userId: string;
  role: "owner" | "editor";
}

function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });

  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, doc) => {
        const roomData = doc.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: doc.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: doc.id,
            ...roomData,
          });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />
      {/* Your Documents */}
      <div className="flex flex-col py-4 space-y-4 md:max-w-36">
        {groupedData.owner.length > 0 ? (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Your Documents
            </h2>
            {groupedData.owner.map((room) => (
              <SidebarOptions
                key={room.id}
                href={`/doc/${room.id}`}
                id={room.id}
              />
            ))}
          </>
        ) : (
          <h2 className="text-gray-500 font-semibold text-sm">
            No documents created
          </h2>
        )}
        {/* Shared with me */}
        {groupedData.owner.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with me
            </h2>
            {groupedData.editor.map((room) => (
              <SidebarOptions
                key={room.id}
                href={`/doc/${room.id}`}
                id={room.id}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative items-center">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}

export default Sidebar;
