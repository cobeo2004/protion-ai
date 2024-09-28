"use client";

import { Button } from '@/components/ui/button'
import { createNewDocument } from '../../server/actions';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react'

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    })
  }
  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Loading..." : "New Document"}
    </Button>
  )
}

export default NewDocumentButton
