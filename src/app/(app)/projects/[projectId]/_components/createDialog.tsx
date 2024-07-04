// app/projects/[projectId]/_components/createDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog as UIDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface CreateDialogProps {
  onCreateIntegration: (
    integrationName: string,
    integrationType: string
  ) => Promise<any>;
  icon: ReactNode;
  buttonText: string;
}

export function CreateDialog({
  onCreateIntegration,
  icon,
  buttonText,
}: CreateDialogProps) {
  const [integrationName, setIntegrationName] = useState("");
  const [integrationType, setIntegrationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCreateIntegration = async () => {
    setLoading(true);
    setStatus("idle");
    const success = await onCreateIntegration(integrationName, integrationType);
    setLoading(false);
    if (success) {
      setStatus("success");
      setIntegrationName(""); // Clear input field after submission
      setIntegrationType(""); // Clear type field after submission
      setTimeout(() => {
        setStatus("idle");
        document.getElementById("closeDialog")?.click(); // Programmatically close the dialog

        toast("Integration has been created", {
          description: "Integration creation was successful.",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }, 1000);
    } else {
      setStatus("error");
    }
  };

  return (
    <UIDialog>
      <DialogTrigger asChild>
        <Button id="closeDialog">
          {icon}
          <span className="pl-2">{buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Integration</DialogTitle>
          <DialogDescription>
            Enter the name of your new integration and select Type.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="integrationName" className="text-right">
              Integration Name
            </Label>
            <Input
              id="integrationName"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="integrationType" className="text-right">
              Select Type
            </Label>
            <Select onValueChange={setIntegrationType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="comingSoon">Coming Soon</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleCreateIntegration}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : status === "success" ? (
              <span>Done</span>
            ) : status === "error" ? (
              <span>Error</span>
            ) : (
              <span>Create Integration</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
