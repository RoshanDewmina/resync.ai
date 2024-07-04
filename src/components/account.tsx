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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DeleteAccountPage from "@/app/(app)/settings/deleteAccount";

export function Account() {
  function setTheme(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col gap-6 ">
      <div className="ring-1 ring-gray-200 rounded-xl p-2">
        <header className="bg-muted px-4 py-6 sm:px-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Account</h1>
              <p className="text-muted-foreground">
                Manage your account and subscription
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6">
        <section>
          <h2 className="text-3xl font-bold p-6">Account Management</h2>
          <div className="grid gap-4 ring-1 ring-gray-200 rounded-xl p-2">
            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>
                  Update your personal information like name, email, password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <Button>Update Profile</Button>

                <DeleteAccountPage />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Update your payment method and billing details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" defaultValue="4111 1111 1111 1111" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" defaultValue="12/24" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" defaultValue="123" />
                  </div>
                </div>
                <Button>Update Billing</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                  //  id="language"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                  // id="timezone"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-bold p-6">Subscription Management</h2>
          <div className="grid gap-4 ring-1 ring-gray-200 rounded-xl p-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Subscription Plan</CardTitle>
                <CardDescription>
                  Upgrade, downgrade or change your current subscription plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline">Change Plan</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pause Subscription</CardTitle>
                <CardDescription>
                  Temporarily pause your current subscription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">Pause Subscription</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cancel Subscription</CardTitle>
                <CardDescription>
                  Cancel your current subscription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Cancel Subscription</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
