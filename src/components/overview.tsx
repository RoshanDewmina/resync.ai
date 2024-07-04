"use client";
import React, { useEffect, useState } from "react";
import { TokenDrawer } from "@/app/(app)/overview/_components/drawer-credits";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { CreditCardIcon, DatabaseIcon } from "lucide-react";
import { toast } from "sonner";

const fetchAnalyticsData = async () => {
  const res = await fetch("/api/analytics");
  const data = await res.json();
  return data;
};

export function Overview() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [storageUsage, setStorageUsage] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    const getAnalyticsData = async () => {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);

      if (data.storageUsage && data.storageLimit) {
        const usagePercentage = (data.storageUsage / data.storageLimit) * 100;
        setStorageUsage(usagePercentage);

        if (usagePercentage > 90) {
          toast("Storage Almost Full", {
            description: "You are using more than 90% of your storage. Consider upgrading your plan.",
          });
        }
      }

      if (data.tokenCount) {
        setTokenCount(data.tokenCount);
      }
    };
    getAnalyticsData();
  }, []);

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good Morning" : "Good Evening";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="ring-1 ring-gray-200 rounded-xl p-2">
        <header className="text-primary-foreground py-4 px-6 flex items-center justify-between rounded-lg">
          <h1 className="text-black text-3xl font-bold">Overview</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <DatabaseIcon className="w-5 h-5 text-black" />
              <span className="text-black">{storageUsage.toFixed(2)}% Used</span>
            </div>
            <Button variant="secondary" className="flex items-center gap-1">
              <CreditCardIcon className="w-5 h-5" />
              <span>{tokenCount} Tokens</span>
            </Button>
            <TokenDrawer />
            <Button variant="destructive" className="h-9">
              Upgrade
            </Button>
          </div>
        </header>
      </div>

      <main className="flex-1 grid gap-6 mt-10 md:p-10 ring-1 ring-gray-200 rounded-xl p-2">
        {analyticsData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-1/2 ">
              <Card>
                <CardHeader>
                  <CardTitle>Total Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.totalQuestions}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.frequentlyAskedQuestions[0]?.content ||
                      "N/A"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Created Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.totalProjects}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart data={analyticsData.monthlyQuestions} />
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
              <Card>
                <CardHeader>
                  <CardTitle>Suggestions</CardTitle>
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
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function LineChart({ data }: { data: any[] }) {
  const formattedData = [
    {
      id: "Questions",
      data: data.map((item) => ({
        x: `${item.month}/${item.year}`,
        y: item._sum.questions,
      })),
    },
  ];

  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month/Year",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Questions",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
