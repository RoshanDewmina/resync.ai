// import { Button } from "@/components/ui/button";
// import {
//   Dialog as UIDialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ReactNode, useState } from "react";
// import { toast } from "sonner";

// interface CreateDialogProps {
//   onCreateChatSession: (projectName: string) => Promise<boolean>;
//   icon: ReactNode;
//   buttonText: string;
// }

// export function CreateDialog({
//   onCreateChatSession,
//   icon,
//   buttonText,
// }: CreateDialogProps) {
//   const [projectName, setChatSessionName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

//   const handleCreateChatSession = async () => {
//     setLoading(true);
//     setStatus("idle");
//     const success = await onCreateChatSession(projectName);
//     setLoading(false);
//     if (success) {
//       setStatus("success");
//       setChatSessionName(""); // Clear input field after submission
//       setTimeout(() => {
//         setStatus("idle");
//         document.getElementById("closeDialog")?.click(); // Programmatically close the dialog

//         toast("ChatSession has been created", {
//           description: "ChatSession creation was successful.",
//           action: {
//             label: "Undo",
//             onClick: () => console.log("Undo"),
//           },
//         });
//       }, 1000);
//     } else {
//       setStatus("error");
//     }
//   };

//   return (
//     <UIDialog>
//       <DialogTrigger asChild>
//         <Button id="closeDialog">
//           {icon}
//           <span className="pl-2">{buttonText}</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create ChatSession</DialogTitle>
//           <DialogDescription>
//             Enter the name of your new project and click create.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="projectName" className="text-right">
//               ChatSession Name
//             </Label>
//             <Input
//               id="projectName"
//               value={projectName}
//               onChange={(e) => setChatSessionName(e.target.value)}
//               className="col-span-3"
//               disabled={loading}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button
//             type="button"
//             onClick={handleCreateChatSession}
//             disabled={loading}
//           >
//             {loading ? (
//               <span>Loading...</span>
//             ) : status === "success" ? (
//               <span>Done</span>
//             ) : status === "error" ? (
//               <span>Error</span>
//             ) : (
//               <span>Create ChatSession</span>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </UIDialog>
//   );
// }
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
  onCreateChatSession: (projectName: string) => Promise<boolean>;
  icon: ReactNode;
  buttonText: string;
}

export function CreateDialog({
  onCreateChatSession,
  icon,
  buttonText,
}: CreateDialogProps) {
  const [projectName, setChatSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCreateChatSession = async () => {
    setLoading(true);
    setStatus("idle");
    const success = await onCreateChatSession(projectName);
    setLoading(false);
    if (success) {
      setStatus("success");
      setChatSessionName(""); // Clear input field after submission
      setTimeout(() => {
        setStatus("idle");
        document.getElementById("closeDialog")?.click(); // Programmatically close the dialog

        toast("ChatSession has been created", {
          description: "ChatSession creation was successful.",
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
          <DialogTitle>Create Chat Session</DialogTitle>
          <DialogDescription>
            Enter the name of your new Chat Session and click create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              ChatSession Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setChatSessionName(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleCreateChatSession}
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : status === "success" ? (
              <span>Done</span>
            ) : status === "error" ? (
              <span>Error</span>
            ) : (
              <span>Create ChatSession</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
