import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, User, HomeIcon, Text, BluetoothConnected, Upload, Box, Wand } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/overview", title: "Overview", icon: HomeIcon },
  { href: "/projects", title: "Projects", icon: Globe },
  { href: "/upload", title: "Upload", icon: Upload },
  { href: "/chat-sessions/", title: "Chat Sessions", icon: Text },
  {href: "/components", title: "Components", icon: Box},
  // {href:"/integrations", title: "Integrations", icon: BluetoothConnected},
  {href:"insights" ,title:"Insights", icon:Wand},
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
