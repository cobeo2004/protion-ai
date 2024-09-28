"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import React from "react";

function WhoIsEditing() {
  const others = useOthers();
  const self = useSelf();
  const all = [self, ...others];
  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">You are editing with:</p>
      <div className="flex -space-x-5">
        {all.map((user, i) => (
          <TooltipProvider key={user?.id + i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage src={user.info.avatar} />
                  <AvatarFallback>
                    {user.info.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === user?.id ? "You" : user?.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

export default WhoIsEditing;
