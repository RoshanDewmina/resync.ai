"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clipboard } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import Comps from "./comps";
import { NextUIProvider } from "@nextui-org/react";
import ResyncWidget from "@/components/widget/widget";

export default function IntegrationComponent() {
  const [copied, setCopied] = useState<string | null>(null);

  const components = [
    {
      name: "Search Bar",
      description:
        "A versatile button component with various styles and sizes.",
      preview: (
        <NextUIProvider>
          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            children={undefined}
          />
        </NextUIProvider>
      ),
      instructions: `
        1. Install the component:
        \`\`\`
        npm install @acme/button
        \`\`\`
        2. Import the component:
        \`\`\`
        import { Button } from '@acme/button';
        \`\`\`
        3. Use the component:
        \`\`\`
        <Button>Click me</Button>
        \`\`\`
      `,
      usage: `
      import React from 'react';
      import { NextUIProvider } from "@nextui-org/react";
      import ResyncWidget from "@/components/resync-widget";
      
      function App() {
        return (
        <>
        <NextUIProvider>
        <ResyncWidget
          authorization={process.env.RESYNC_API_KEY! as string}
          integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
          organizationDisplayName="Your Organization name“
          // title="Hi!"
          description="How can i Help?"
          primaryBrandColor="hsl(var--primary)"
          children={undefined}
        />
      </NextUIProvider>
        </>
        );
      }
      
      export default App;
      
      `,
    },
    {
      name: "Icon",
      description: "A flexible card component for displaying content.",
      preview: (
        <NextUIProvider>
          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            searchButtonType="iconSearch"
            children={undefined}
          />
        </NextUIProvider>
      ),
      instructions: `
        1. Install ShadcnUi
        \`\`\`
        npm install @acme/card
        \`\`\`
        2. Import the component:
        \`\`\`
        import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@acme/card';
        \`\`\`
        3. Use the component:
        \`\`\`
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here.</p>
          </CardContent>
        </Card>
        \`\`\`
      `,
      usage: `
      import React from 'react';
      import { NextUIProvider } from "@nextui-org/react";
      import ResyncWidget from "@/components/resync-widget";
      
      function App() {
        return (
        <>
        <NextUIProvider>
        <ResyncWidget
          authorization={process.env.RESYNC_API_KEY! as string}
          integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
          organizationDisplayName="Your Organization name“
          // title="Hi!"
          description="How can i Help?"
          primaryBrandColor="hsl(var--primary)"
          searchButtonType="iconSearch"
          children={undefined}
        />
      </NextUIProvider>
        </>
        );
      }
      
      export default App;
      `,
    },
    {
      name: "Icon Text",
      description:
        "A customizable avatar component for displaying user profiles.",
      preview: (
        <NextUIProvider>
          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            searchButtonType="icon"
            children={undefined}
          />
        </NextUIProvider>
      ),
      instructions: `
        1. Install the component:
        \`\`\`
        npm install @acme/avatar
        \`\`\`
        2. Import the component:
        \`\`\`
        import { Avatar, AvatarImage, AvatarFallback } from '@acme/avatar';
        \`\`\`
        3. Use the component:
        \`\`\`
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        \`\`\`
      `,
      usage: `
      import React from 'react';
      import { NextUIProvider } from "@nextui-org/react";
      import ResyncWidget from "@/components/resync-widget";
      
      function App() {
        return (
        <>
        <NextUIProvider>
        <ResyncWidget
          authorization={process.env.RESYNC_API_KEY! as string}
          integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
          organizationDisplayName="Your Organization name“
          // title="Hi!"
          description="How can i Help?"
          primaryBrandColor="hsl(var--primary)"
          searchButtonType="icon"
          children={undefined}
        />
      </NextUIProvider>
        </>
        );
      }
      
      export default App;
      `,
    },
  ];

  const handleCopy = (name: string) => {
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Reusable UI Components
            </h2>
            <p className=" text-muted-foreground md:text-xl/relaxed content-center text-center">
              Explore our collection of beautifully designed and highly
              customizable UI components made with{" "}
              <span className="underline">NextUi</span>.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component: any, index) => (
              <Card key={index} className="group">
                <CardHeader>
                  <CardTitle>{component.name}</CardTitle>
                  <CardDescription>{component.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      {component.preview}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <CopyToClipboard
                      text={component.usage}
                      onCopy={() => handleCopy(component.name)}
                    >
                      <Button variant="outline">
                        <Clipboard className="w-4 h-4" />
                      </Button>
                    </CopyToClipboard>
                    <div className="text-sm text-muted-foreground">
                      {copied === component.name ? "Copied!" : "Copy the component"}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex-col space-y-2">
                    {/* <ul className="list-disc pl-5">
                      <li>1. Install ShadcnUi:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md whitespace-pre-wrap">
                        <code>{component.instructions.split('\n')[1].trim()}</code>
                      </pre>
                      <li>2. Install Resync Widget:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md whitespace-pre-wrap">
                        <code>{component.instructions.split('\n')[4].trim()}</code>
                      </pre>
                      <li>3. Customize the way you want or use as is:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md whitespace-pre-wrap">
                        <code>{component.instructions.split('\n')[7].trim()}</code>
                      </pre>
                    </ul> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
