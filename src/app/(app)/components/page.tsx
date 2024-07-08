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

export default function IntegrationComponent() {
  const [copied, setCopied] = useState<string | null>(null);

  const components = [
    {
      name: "Search Bar",
      description:
        "A versatile button component with various styles and sizes.",
      preview: (
        <Image
          src="/components/searchbar.png"
          width="150"
          height="150"
          alt="Search Bar Preview"
          className="scale-100"
        />
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
      import { SearchDialog } from 'resync-widget';
      
      function App() {
        const authorization = '81ef5963-d73c-483f-8b8f-31814c4dd924';
        const integrationId = '374a0f01-b1d5-4dd6-a98e-dd1b71c5bc23';
      
        const customClassNames = {
          button: 'text-white',
          card: 'custom-card-class',
          cardHeader: 'custom-card-header-class',
          cardBody: 'custom-card-body-class',
          searchButton: 'custom-search-button-class',
          closeButton: 'custom-close-button-class',
          submitButton: 'custom-submit-button-class',
        };
      
        return (
          <div className="App">
          <SearchDialog
          authorization="your-api-key"
          integrationId="your-integration-id"
          guidance="Custom guidance text (optional)"
          context="Custom context (optional)"
          role="user"
          title="Custom Title"
          description="Custom Description"
          searchButtonType="searchbar"
          classNames={customClassNames}
        />
          </div>
        );
      }
      
      export default App;
      
      `,
    },
    {
      name: "Icon",
      description: "A flexible card component for displaying content.",
      preview:  <Image
      src="/components/icon.png"
      width="100"
      height="100"
      alt="Search Bar Preview"
      className="scale-50"
    />,
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
      import { SearchDialog } from 'resync-widget';
      
      function App() {
      
        const customClassNames = {
          button: 'text-white',
          card: 'custom-card-class',
          cardHeader: 'custom-card-header-class',
          cardBody: 'custom-card-body-class',
          searchButton: 'custom-search-button-class',
          closeButton: 'custom-close-button-class',
          submitButton: 'custom-submit-button-class',
        };
      
        return (
          <div className="App">
          <SearchDialog
          authorization="your-api-key"
          integrationId="your-integration-id"
          guidance="Custom guidance text (optional)"
          context="Custom context (optional)"
          role="user"
          title="Custom Title"
          description="Custom Description"
          searchButtonType="icon"
          classNames={customClassNames}
        />
          </div>
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
        <Image
        src="/components/icontext.png"
        width="100"
        height="100"
        alt="Search Bar Preview"
        className="scale-50"
      />
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
      import { SearchDialog } from 'resync-widget';
      
      function App() {
      
        const customClassNames = {
          button: 'text-white',
          card: 'custom-card-class',
          cardHeader: 'custom-card-header-class',
          cardBody: 'custom-card-body-class',
          searchButton: 'custom-search-button-class',
          closeButton: 'custom-close-button-class',
          submitButton: 'custom-submit-button-class',
        };
      
        return (
          <div className="App">
          <SearchDialog
          authorization="your-api-key"
          integrationId="your-integration-id"
          guidance="Custom guidance text (optional)"
          context="Custom context (optional)"
          role="user"
          title="Custom Title"
          description="Custom Description"
          searchButtonType="iconText"
          classNames={customClassNames}
        />
          </div>
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
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Explore our collection of beautifully designed and highly
              customizable UI components made with{" "}
              <span className="underline">ShadcnUI</span>.
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
                      {copied === component.name ? "Copied!" : "Instructions"}
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
