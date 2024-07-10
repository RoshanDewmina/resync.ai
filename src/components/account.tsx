import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DeleteAccountPage from "../app/(app)/settings/[[...rest]]/deleteAccount";
import { UserButton, UserProfile } from "@clerk/nextjs";

export function Account() {
  const [email, setEmail] = useState("john@example.com");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("/api/update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="ring-1 ring-gray-200 rounded-xl p-2">
        <header className="bg-muted px-4 py-6 sm:px-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Account</h1>
              <p className="text-muted-foreground">Manage your account</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="scale-150 p-12 flex-col items-center align-middle justify-center">
                <UserButton />
              </Avatar>
              <div className="space-y-0.5">
                {/* <p className="text-sm font-medium">{firstName} {lastName}</p>
                <p className="text-sm text-muted-foreground">
                  {email}
                </p> */}
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="grid grid-cols-1 p-4 m-4">
        <section>
          <h2 className="text-3xl font-bold p-6">Account Management</h2>
          <div className=" ring-gray-200 rounded-xl p-2 pb-6">
            <UserProfile />
          </div>
          <div className="ring-1 ring-gray-200 rounded-xl p-2">
            {/* <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>
                  Update your personal information like name and email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
                {message && <p>{message}</p>}
                <DeleteAccountPage />
              </CardContent>
            </Card> */}

            <DeleteAccountPage />
          </div>
        </section>
      </div>
    </div>
  );
}
