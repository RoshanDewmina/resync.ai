"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Minus, Plus, PlusCircleIcon } from "lucide-react";

const tokenOptions = [
  { amount: 2500, price: 19 },
  { amount: 7000, price: 49 },
  { amount: 15000, price: 99 },
  { amount: 40000, price: 249 },
  { amount: 80000, price: 499 },
  { amount: 170000, price: 999 },
  { amount: 350000, price: 1999 },
  { amount: 900000, price: 4999 },
];

export default function PurchaseTokens() {
  const [tokenAmount, setTokenAmount] = useState(tokenOptions[0].amount); // Default value set to 2500 tokens
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the user's current token balance when the component mounts
    const fetchTokenBalance = async () => {
      try {
        const response = await fetch("/api/user/tokens", {
          method: "GET",
        });
        const data = await response.json();
        // Ensure data.balance is a number
        if (typeof data.balance === 'number') {
          setUserTokenBalance(data.balance);
        } else {
          console.error("Error: balance is not a number");
        }
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };

    fetchTokenBalance();
  }, []);

  const handleTokenAmountChange = (value: number) => {
    setTokenAmount(value);
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: "OneTime",
          tokens: tokenAmount,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error creating Stripe session");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      setLoading(false);
    }
  };

  return (
    <TokenDrawer
      tokenAmount={tokenAmount}
      handleTokenAmountChange={handleTokenAmountChange}
      handlePurchase={handlePurchase}
      loading={loading}
      userTokenBalance={userTokenBalance}
    />
  );
}

function TokenDrawer({
  tokenAmount,
  handleTokenAmountChange,
  handlePurchase,
  loading,
  userTokenBalance,
}: {
  tokenAmount: number;
  handleTokenAmountChange: (value: number) => void;
  handlePurchase: () => void;
  loading: boolean;
  userTokenBalance: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(
    tokenOptions.findIndex((option) => option.amount === tokenAmount)
  );

  useEffect(() => {
    setCurrentIndex(tokenOptions.findIndex((option) => option.amount === tokenAmount));
  }, [tokenAmount]);

  function onClick(adjustment: number) {
    const newIndex = currentIndex + adjustment;
    if (newIndex >= 0 && newIndex < tokenOptions.length) {
      setCurrentIndex(newIndex);
      handleTokenAmountChange(tokenOptions[newIndex].amount);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" className="flex items-center gap-1">
          <PlusCircleIcon className="w-5 h-5" />
          <span>Buy Tokens</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Purchase Tokens</DrawerTitle>
            <DrawerDescription>
              Select the amount of Tokens to purchase
            </DrawerDescription>
          </DrawerHeader>
          <Card className="p-6 space-y-6">
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Token Amount</Label>
                  <div className="flex items-center justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => onClick(-1)}
                      disabled={currentIndex <= 0}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-7xl font-bold tracking-tighter">
                        {tokenOptions[currentIndex].amount}
                      </div>
                      <div className="text-[0.70rem] uppercase text-muted-foreground">
                        Tokens
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => onClick(1)}
                      disabled={currentIndex >= tokenOptions.length - 1}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                  <div className="grid gap-1 mt-4">
                    <Label>Total Cost</Label>
                    <div className="text-4xl font-bold">
                      ${tokenOptions[currentIndex].price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <span>Your Current Token Balance:</span>
                  <span className="font-medium">{userTokenBalance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Tokens After Purchase:</span>
                  <span className="font-medium">
                    {userTokenBalance + tokenOptions[currentIndex].amount}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePurchase}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Purchase Tokens"}
              </Button>
            </CardFooter>
          </Card>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
