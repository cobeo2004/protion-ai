"use client";

import { SignedIn, UserButton } from "@clerk/clerk-react";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center p-5">
      {user && (
        <h1 className="text-2xl font-bold">
          {user?.firstName}
          {`'s`} space
        </h1>
      )}
      <Breadcrumbs />
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
