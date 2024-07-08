"use client";
import { Account } from "@/components/account";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Page() {
  const { setTheme } = useTheme();
  return (
    <>
      <Account />
    </>
  );
}
