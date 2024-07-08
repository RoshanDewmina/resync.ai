"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function PurchaseTokens() {
  const [tokenAmount, setTokenAmount] = useState(2500) // Default value set to 2500 tokens
  const [userTokenBalance, setUserTokenBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch the user's current token balance when the component mounts
    const fetchTokenBalance = async () => {
      try {
        const response = await fetch('/api/user/tokens', {
          method: 'GET',
        })
        const data = await response.json()
        setUserTokenBalance(data.balance)
      } catch (error) {
        console.error("Error fetching token balance:", error)
      }
    }

    fetchTokenBalance()
  }, [])

  const handleTokenAmountChange = (value: any) => {
    setTokenAmount(parseInt(value))
  }

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'OneTime',
          tokens: tokenAmount,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Error creating Stripe session")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error during purchase:", error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
          <CardDescription>Select the number of tokens you would like to purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="token-amount">Token Amount</Label>
              <Select value={tokenAmount.toString()} onValueChange={handleTokenAmountChange}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"2500"}>2500</SelectItem>
                  <SelectItem value={"7000"}>7000</SelectItem>
                  <SelectItem value={"15000"}>15000</SelectItem>
                  <SelectItem value={"40000"}>40000</SelectItem>
                  <SelectItem value={"80000"}>80000</SelectItem>
                  <SelectItem value={"170000"}>170000</SelectItem>
                  <SelectItem value={"350000"}>350000</SelectItem>
                  <SelectItem value={"900000"}>900000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Total Cost</Label>
              <div className="text-4xl font-bold">${(tokenAmount / 100).toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePurchase} className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Purchase Tokens'}
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-8 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <span>Your Current Token Balance:</span>
          <span className="font-medium">{userTokenBalance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total Tokens After Purchase:</span>
          <span className="font-medium">{userTokenBalance + tokenAmount}</span>
        </div>
      </div>
    </div>
  )
}
