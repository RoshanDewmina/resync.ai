"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  FileIcon,
  DownloadIcon,
  Trash2,
  Globe,
  File,
  Link,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface UploadedFile {
  id: string;
  name: string;
  uploadedDate: string;
  size?: number;
  url?: string;
  icon?: string;
  maxDepth?: number;
  excludeDirs?: string[];
}

const UploadDocuments = ({ params }: { params: { integrationId: string } }) => {
  const { integrationId } = params;
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (integrationId) {
      fetchUploadedFiles();
    }
  }, [integrationId]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`/api/upload/${integrationId}`);
      const files = await response.json();

      if (Array.isArray(files)) {
        setUploadedFiles(files);
      } else {
        console.error(
          "Failed to fetch uploaded files: Response is not an array"
        );
      }
    } catch (error) {
      console.error("Failed to fetch uploaded files", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const files = (event.target as HTMLFormElement).file.files;
    const url = (event.target as HTMLFormElement).url.value;
    const integrationId = (event.target as HTMLFormElement).integrationId.value;
    const maxDepth = (event.target as HTMLFormElement).maxDepth.value;
    const excludeDirs = (
      event.target as HTMLFormElement
    ).excludeDirs.value.split(",");

    try {
      const fileUploadResponse = files.length
        ? await handleFileUpload(files, integrationId)
        : null;
      const urlUploadResponse = url
        ? await handleUrlUpload(url, integrationId, maxDepth, excludeDirs)
        : null;

      if (fileUploadResponse?.ok || urlUploadResponse?.ok) {
        toast.success("Upload Successful", {
          description: "Your documents have been uploaded successfully.",
        });
        console.log("Upload and processing successful");

        // Clear form inputs
        if (formRef.current) {
          formRef.current.reset();
        }

        // Fetch the updated list of uploaded files
        fetchUploadedFiles();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload Failed", {
        description:
          "There was an error uploading your documents. Please try again.",
      });
      console.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList, integrationId: string) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("integrationId", integrationId);

    const response = await fetch("/api/upload/file", {
      method: "POST",
      body: formData,
    });

    return response;
  };

  const handleUrlUpload = async (
    url: string,
    integrationId: string,
    maxDepth: string,
    excludeDirs: string[]
  ) => {
    const response = await fetch("/api/upload/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ integrationId, url, maxDepth, excludeDirs }),
    });

    return response;
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/upload/${integrationId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: fileId }), // Pass the file ID in the request body
      });

      if (response.ok) {
        toast.success("File Deleted", {
          description: "The file has been deleted successfully.",
        });
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Delete Failed", {
        description: "There was an error deleting the file. Please try again.",
      });
      console.error("Delete failed", error);
    }
  };

  return (
    <Card className="w-full min-w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload files or provide a URL to add documents to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">File Upload</Label>
              <Input id="file" name="file" type="file" multiple />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" placeholder="Enter a URL" />
              <Input
                id="maxDepth"
                name="maxDepth"
                placeholder="Max Depth (optional)"
              />
              <Input
                id="excludeDirs"
                name="excludeDirs"
                placeholder="Exclude Directories (comma separated)"
              />
            </div>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="integrationId">Integration ID</Label>
            <Input id="integrationId" name="integrationId" required />
          </div> */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Load Documents"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="grid gap-4">
          <h4 className="text-lg font-medium">Uploaded Documents</h4>
          <div className="h-48 overflow-y-auto">
            {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    {file.url ? (
                      // <img
                      //   src={file.icon }
                      //   alt="icon"
                      //   className="h-6 w-6"
                      // />
                      <Link className="h-6 w-6 text-primary" />
                    ) : (
                      // <img
                      //   src={file.icon || "/default-icon.png"}
                      //   alt="icon"
                      //   width="6"
                      //   height="6"
                      // />
                      <FileIcon className="h-6 w-6 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">
                        {file.url ? (
                          <a href={file.url}>{file.name}</a>
                        ) : (
                          file.name
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {file.uploadedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {file.url ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <DownloadIcon className="h-5 w-5" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No uploaded documents found.</p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UploadDocuments;
