"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useOwner from "@/hooks/useOwner";
import { db } from "@/lib/firebase/firebaseHelper";
import { removeUserFromDoc } from "@/server/actions";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import React, { useState, useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

function ManageUsers() {
  const { user } = useUser();
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );
  const isOwner = useOwner();

  const handleDeleteUser = async (userId: string) => {
    startTransition(async () => {
      if (!user) return;
      const { success } = await removeUserFromDoc(room.id, userId);
      if (success) {
        toast.success("User removed successfully");
      } else {
        toast.error("Failed to remove user");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users Access Control</DialogTitle>
          <DialogDescription>
            Manage users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />
        <div className="flex flex-col gap-4">
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className="flex items-center justify-between"
            >
              <p className="font-light">
                {doc.data().userId === user?.emailAddresses[0].toString()
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  className={`px-2 py-1 text-sm ${
                    doc.data().role === "owner"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                >
                  {(doc.data().role as string).charAt(0).toUpperCase() +
                    (doc.data().role as string).slice(1)}
                </Badge>
                {isOwner &&
                  doc.data().userId !== user?.emailAddresses[0].toString() && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(doc.data().userId)}
                      className="px-3 py-1 text-sm"
                    >
                      {isPending ? "Removing..." : "Remove"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageUsers;
