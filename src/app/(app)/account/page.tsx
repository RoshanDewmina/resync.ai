"use client"
import React, { useState } from 'react';

const tokenPlans = [
  { id: '20', tokens: 2500, price: 20 },
  { id: '50', tokens: 7000, price: 50 },
  { id: '100', tokens: 15000, price: 100 },
  { id: '250', tokens: 40000, price: 250 },
  { id: '500', tokens: 80000, price: 500 },
  { id: '1000', tokens: 170000, price: 1000 },
  { id: '2000', tokens: 350000, price: 2000 },
  { id: '5000', tokens: 900000, price: 5000 },
];

const TokenPurchase = () => {
  const [selectedPlan, setSelectedPlan] = useState(tokenPlans[0].id);
  const [loading, setLoading] = useState(false);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlan(e.target.value);
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const selectedTokenPlan = tokenPlans.find(plan => plan.id === selectedPlan);

      if (!selectedTokenPlan) {
        throw new Error('Selected plan not found');
      }

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'OneTime',
          tokens: selectedTokenPlan.tokens,
        }),
      });

      const data = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error initiating purchase:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Purchase Tokens</h1>
      <div>
        <label htmlFor="tokenPlan">Select a plan:</label>
        <select
          id="tokenPlan"
          value={selectedPlan}
          onChange={handlePlanChange}
          disabled={loading}
        >
          {tokenPlans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.tokens} tokens for ${plan.price}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handlePurchase} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Tokens'}
      </button>
    </div>
  );
};

export default TokenPurchase;
