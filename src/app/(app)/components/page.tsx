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
import IconDialog from "../temp/IconDialog";
import SearchDialog from "../temp/SearchDialog";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function IntegrationComponent() {
  const [copied, setCopied] = useState<string | null>(null);

  const components = [
    {
      name: "Icon",
      description: "A versatile button component with various styles and sizes.",
      preview: <IconDialog />,
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
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
      `,
    },
    {
      name: "Search Bar",
      description: "A flexible card component for displaying content.",
      preview: <div className="p-6 m-8">{/* <SearchDialog /> */}</div>,
      instructions: `
        1. Install the component:
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Featured Product</CardTitle>
            <CardDescription>Check out our latest offering.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Product details go here.</p>
          </CardContent>
          <CardFooter>
            <Button variant="primary">Learn More</Button>
          </CardFooter>
        </Card>
      `,
    },
    {
      name: "Avatar",
      description: "A customizable avatar component for displaying user profiles.",
      preview: (
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="@jaredpalmer" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="@maxleiter" />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
        </div>
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
              customizable UI components.
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
                  <div className="text-sm text-muted-foreground">
                    <ul>
                      <li>1. Install the component:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md">
                        <code>{component.instructions.split('\n')[1]}</code>
                      </pre>
                      <li>2. Import the component:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md">
                        <code>{component.instructions.split('\n')[4]}</code>
                      </pre>
                      <li>3. Use the component:</li>
                      <pre className="p-4 text-sm font-mono bg-muted rounded-md">
                        <code>{component.instructions.split('\n')[7]}</code>
                      </pre>
                    </ul>
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
