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
import { BotIcon, MessagesSquareIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import * as Y from "yjs";

function AIChatToDoc({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");

  const handleChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const body = JSON.stringify({
        documentData,
        question,
      });
      console.log(body);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.ok) {
        const { response } = await res.json();
        setSummary(response);
        toast.success("Translated document successfully");
      } else {
        toast.error("Failed to translate document");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessagesSquareIcon className="mr-1" />
          Chat to Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to Document</DialogTitle>
          <DialogDescription>
            Empowering the power of Protion AI to chat within your document.
          </DialogDescription>
          <hr className="mt-5" />

          {summary && (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  Protion AI {isPending ? "is thinking..." : "replies:"}
                </p>
              </div>
              <p>
                {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
              </p>
            </div>
          )}
        </DialogHeader>
        <form className="flex flex-row gap-2" onSubmit={handleChat}>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question"
          />
          <Button type="submit" disabled={isPending || !question}>
            {isPending ? "Chatting..." : "Chat"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AIChatToDoc;
