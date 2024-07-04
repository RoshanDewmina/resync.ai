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
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface CreateDialogProps {
  onCreateProject: (projectName: string) => Promise<boolean>;
  icon: ReactNode;
  buttonText: string;
}

export function CreateDialog({
  onCreateProject,
  icon,
  buttonText,
}: CreateDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCreateProject = async () => {
    setLoading(true);
    setStatus("idle");
    const success = await onCreateProject(projectName);
    setLoading(false);
    if (success) {
      setStatus("success");
      setProjectName(""); // Clear input field after submission
      setTimeout(() => {
        setStatus("idle");
        document.getElementById("closeDialog")?.click(); // Programmatically close the dialog

        toast("Project has been Created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Enter the name of your new project and click create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleCreateProject}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : status === "success" ? (
              <span>Done</span>
            ) : status === "error" ? (
              <span>Error</span>
            ) : (
              <span>Create Project</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
