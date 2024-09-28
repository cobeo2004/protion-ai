import React from "react";
import LiveBlocksProvider from "./_components/LiveBlocksProvider";

export default function DocLayout({ children }: { children: React.ReactNode }) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
