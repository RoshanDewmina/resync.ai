import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";

const IntegrationContextMenu = ({ integration }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset the copied state after 2 seconds
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[50px] w-[150px] items-center justify-center rounded-md border border-dashed text-sm">
        <Button className="text-blue-600" variant="link">
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <span className="p-2">Right Click to View</span>
          )}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="p-1 flex items-center m-2">
          <CopyToClipboard text={integration.apiKey} onCopy={handleCopy}>
            <p className="cursor-pointer flex items-center space-x-2">
              <Clipboard className="w-4 h-4" />
              <span>{integration.apiKey}</span>
            </p>
          </CopyToClipboard>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default IntegrationContextMenu;
