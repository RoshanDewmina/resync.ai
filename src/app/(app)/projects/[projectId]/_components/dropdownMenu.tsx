// app/projects/[projectId]/_components/dropdownMenu.tsx
import {
  LogOut,
  User,
  CreditCard,
  Settings,
  UserPlus,
  Mail,
  MessageSquare,
  PlusCircle,
  EllipsisIcon,
  Upload,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";

interface DropdownOptionsProps {
  integrationId: string;
  onDeleteIntegration: (integrationId: string) => void;
}

export function DropdownOptions({
  integrationId,
  onDeleteIntegration,
}: DropdownOptionsProps) {
  const handleDelete = () => {
    onDeleteIntegration(integrationId);
    toast("Integration has been deleted", {
      description: "Integration deletion was successful.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisIcon className="w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Integration Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/overview">
              <span>Overview</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" />
            <Link href="/">
              <span>Upload Files</span>
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <LogOut className="mr-2 h-4 w-4" />
          <span className={buttonVariants({ variant: "link" })}>
            Delete Integration
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
