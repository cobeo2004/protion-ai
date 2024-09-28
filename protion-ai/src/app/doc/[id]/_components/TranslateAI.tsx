import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  supportedTranslationLangs,
  SupportedTranslationLangs,
} from "@/lib/supportedLang";
import { SelectValue } from "@radix-ui/react-select";
import { BotIcon, LanguagesIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import * as Y from "yjs";

function TranslateAI({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [language, setLanguage] =
    useState<SupportedTranslationLangs>("english");

  const [summary, setSummary] = useState("");

  const handleTranslate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const body = JSON.stringify({
        documentData,
        targetLanguage: language,
      });
      console.log(body);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.ok) {
        const { translated_text } = await res.json();
        // Remove <blockgroup> tags if present
        const cleanedText = translated_text.replace(
          /<blockgroup>|<\/blockgroup>/g,
          ""
        );
        setSummary(cleanedText);
        toast.success("Chat with document successfully");
      } else {
        toast.error(
          "Failed to chat with document, throw with error: " + res.status
        );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate</DialogTitle>
          <DialogDescription>
            Translate the document to the language you want using the power of
            Protion AI.
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
        <form className="flex flex-row gap-2" onSubmit={handleTranslate}>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as SupportedTranslationLangs)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {supportedTranslationLangs.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isPending || !language}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateAI;
