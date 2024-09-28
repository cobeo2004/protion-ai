"use client";

import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Breadcrumbs() {
  const path = usePathname();
  const pathSeg = path.split("/").filter((seg) => seg !== "");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathSeg.map((value, index) => {
          if (!value) return null;
          const href = `/${pathSeg.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSeg.length - 1;
          return (
            <React.Fragment key={value}>
              <BreadcrumbSeparator key={value} />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{value}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{value}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
