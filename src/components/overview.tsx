"use client";

import React, { useEffect, useState } from "react";
import PurchaseTokens from "@/app/(app)/overview/_components/drawer-tokens";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCardIcon, DatabaseIcon } from "lucide-react";
import { toast } from "sonner";
import Chart from "@/app/(app)/overview/_components/chart";
import ProjectsPage from "@/app/(app)/projects/page";
import { Separator } from "./ui/separator";

const fetchAnalyticsData = async () => {
  const res = await fetch("/api/analytics");
  const data = await res.json();
  return data;
};

const fetchTokenBalance = async () => {
  const res = await fetch("/api/user/tokens");
  const data = await res.json();
  return data.balance;
};

export function Overview() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [storageUsage, setStorageUsage] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    const getTokenBalance = async () => {
      const balance = await fetchTokenBalance();
      const balanceNumber = Number(balance);
      if (typeof balance === "number") {
        setTokenCount(balanceNumber);
      } else {
        alert("Error: Balance is not a number");
      }
    };

    const getAnalyticsData = async () => {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);

      if (data.storageUsage && data.storageLimit) {
        const usagePercentage = (data.storageUsage / data.storageLimit) * 100;
        setStorageUsage(usagePercentage);

        if (usagePercentage > 80) {
          toast("Storage Almost Full", {
            description:
              "You are using more than 80% of your storage. Consider upgrading your plan.",
          });
        }
      }
    };

    getAnalyticsData();
    getTokenBalance();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="ring-1 ring-gray-200 rounded-xl p-2">
        <header className="text-primary-foreground py-4 px-6 flex items-center justify-between rounded-lg">
          <h1 className="text-black text-3xl font-bold">Overview</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {/* <DatabaseIcon className="w-5 h-5 text-black" /> */}
              {/* <span className="text-black">
                {storageUsage.toFixed(2)}% Used
              </span> */}
            </div>
            <Button variant="secondary" className="flex items-center gap-1">
              <CreditCardIcon className="w-5 h-5" />
              <span>{tokenCount} Tokens</span>
            </Button>
            <PurchaseTokens />
          </div>
        </header>
      </div>

      <main className="flex-1 grid gap-6 mt-10 md:p-10 ring-1 ring-gray-200 rounded-xl p-2">
        {analyticsData && (
          <>
            <ProjectsPage />
            <Separator className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>

                <CardContent>
                  <Chart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.frequentlyAskedQuestions.map(
                      (faq: any, index: number) => (
                        <div key={index}>
                          <h3 className="text-lg font-medium">{faq.content}</h3>
                          <p className="text-muted-foreground ">
                            {faq._count.content} times
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader>
                  <CardTitle>Ask Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Add a dark mode</h3>
                      <p className="text-muted-foreground">
                        Many users have requested a dark mode option for the
                        dashboard.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        Improve the search functionality
                      </h3>
                      <p className="text-muted-foreground">
                        The current search feature could be more powerful and
                        intuitive.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        Integrate with more third-party tools
                      </h3>
                      <p className="text-muted-foreground">
                        Users have asked for integration with tools like Slack,
                        Trello, and Jira.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
