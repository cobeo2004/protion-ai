"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { inviteUserToDocument } from "@/server/actions";
import { usePathname } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const pathName = usePathname();

  const handleInviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomId = pathName.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);
      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success(`Invited user ${email} successfully`);
      } else {
        toast.error("Failed to invite users");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-row gap-2" onSubmit={handleInviteUser}>
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={isPending || !email}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;
