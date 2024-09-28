"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/firebaseHelper";
import { doc, updateDoc } from "firebase/firestore";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/hooks/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import WhoIsEditing from "./WhoIsEditing";

function DocumentContent({ id }: { id: string }) {
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const handleUpdateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form onSubmit={handleUpdateTitle} className="flex flex-1 space-x-2">
          {/* Update title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {/* IF is owner, Invite User, Delete Document */}
          {isOwner && (
            <>
              {/* Invite User */}
              <InviteUser />
              {/* Delete Document */}
              <DeleteDocument />
            </>
          )}
        </form>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* Manage Users */}
        <ManageUsers />
        {/* Avatars */}
        <WhoIsEditing />
      </div>
      <hr className="pb-10" />
      {/* Collaborative Editor */}
      <Editor />
    </div>
  );
}

export default DocumentContent;
