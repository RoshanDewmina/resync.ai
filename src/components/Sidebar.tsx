import Link from "next/link";

import SidebarItems from "./SidebarItems";
import { SignOutButton, UserButton, UserProfile } from "@clerk/nextjs";
import getUser from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

import { AuthSession, getUserAuth } from "@/lib/auth/utils";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Sidebar = async () => {
  return (
    <aside className="h-screen min-w-48  shadow-inner md:block pl-4 pt-8 border-border ">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold ml-4">Logo</h3>
          <SidebarItems />
        </div>

        <div className=" flex p-4 w-full align-middle items-center mr-2 pr-8 ">
          <Button variant="default" className="flex flex-grow space-x-2 w-full">
            <SignOutButton />
            <LogOut className="text-white w-5 h-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
