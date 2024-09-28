"use client";

import React from "react";
import DocumentContent from "./_components/DocumentContent";

function DocumentPage(props: { params: { id: string } }) {
  const { id } = props.params;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <DocumentContent id={id} />
    </div>
  );
}

export default DocumentPage;
