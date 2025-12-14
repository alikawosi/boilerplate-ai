"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { pricingConfig } from "@/config/subscriptions";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* 1. The Toggle Switch */}
      <div className="flex flex-col items-center mb-10 space-y-4">
        <h2 className="text-3xl font-bold text-center">Simple Pricing</h2>
        <div className="flex items-center space-x-4 bg-secondary p-1 rounded-full">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              !isYearly
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              isYearly
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* 2. The Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {pricingConfig.map((plan) => {
          const price = isYearly ? plan.prices.yearly : plan.prices.monthly;

          return (
            <div
              key={plan.id}
              className="flex flex-col p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${price.amount}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed ${price.amount * 12} yearly
                  </p>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.id === "pro" ? "default" : "outline"}
                onClick={() => {
                  // In a real app, this would redirect to a checkout route
                  console.log(`Checkout: ${price.priceId}`);
                }}
              >
                Subscribe to {plan.name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
