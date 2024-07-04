"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DeleteAccountPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
        router.push("/");
        toast.success("Account deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete the account");
      }
    } catch (error) {
      setMessage("An error occurred while deleting the account");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Delete your account and all information associated with your
              account.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleDeleteAccount}>
            <CardContent>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} variant="destructive">
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </CardFooter>
          </form>
          {message && <p>{message}</p>}
        </Card>
      </div>
    </>
  );
};

export default DeleteAccountPage;
