"use client";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [userAuth, setUserAuth] = useState(null);
  const [planType, setPlanType] = useState("Launch");
  const [billingCycle, setBillingCycle] = useState("Monthly");

  const handleSubscription = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType, billingCycle }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch subscription URL");
      }
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6">
      <Link href="/account">
        <Button variant="outline">Account and Billing</Button>
      </Link>
      {userAuth && (
        <pre className="bg-secondary p-4 rounded-sm shadow-sm text-secondary-foreground break-all whitespace-break-spaces">
          {JSON.stringify(userAuth, null, 2)}
        </pre>
      )}
      <div>
        <label>
          Plan Type:
          <select value={planType} onChange={(e) => setPlanType(e.target.value)}>
            <option value="Launch">Launch</option>
            <option value="Accelerate">Accelerate</option>
            <option value="Scale">Scale</option>
          </select>
        </label>
        <label>
          Billing Cycle:
          <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
          </select>
        </label>
      </div>
      <Button
        variant="destructive"
        disabled={loading}
        onClick={handleSubscription}
      >
        <PlusCircleIcon className="mr-2 w-4 h-4" /> Upgrade
      </Button>
    </main>
  );
}
