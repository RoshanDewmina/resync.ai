"use client"
import Link from "next/link";

import SidebarItems from "./SidebarItems";
import { SignOutButton, UserButton, UserProfile } from "@clerk/nextjs";
import getUser from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

import { AuthSession, getUserAuth } from "@/lib/auth/utils";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import ResyncWidget from "./widget/widget";
import { NextUIProvider } from "@nextui-org/react";

const Sidebar = async () => {
  return (
    <aside className="hidden md:block h-screen min-w-48  shadow-inner pl-4 pt-8 border-border ">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold ml-4 text-primary ">Resync</h3>

          <div className="m-4 ">
            <NextUIProvider>
              <ResyncWidget
                // authorization={process.env.RESYNC_API_KEY! as string}
                // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
                authorization="884fef34-4c00-4d85-9a29-21adf9621523"
                integrationId="76882c33-61b7-460d-88b8-260cce563643"
                organizationDisplayName="Resync Ai"
                // title="Hi!"
                description="How can i Help?"
                primaryBrandColor="hsl(var--primary)"
                children={undefined}
              />
            </NextUIProvider>
          </div>

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
