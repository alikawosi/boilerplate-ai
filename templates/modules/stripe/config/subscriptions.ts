export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: {
    monthly: {
      amount: number;
      priceId: string; // Stripe Price ID (e.g. price_123)
    };
    yearly: {
      amount: number;
      priceId: string;
    };
  };
}

export const pricingConfig: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for side projects",
    features: ["Up to 100 users", "Basic Analytics", "24/7 Support"],
    prices: {
      monthly: {
        amount: 9,
        priceId: "price_starter_monthly",
      },
      yearly: {
        amount: 7, // 20% off roughly ($9 * 12 * 0.8 / 12)
        priceId: "price_starter_yearly",
      },
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    features: [
      "Unlimited users",
      "Advanced Analytics",
      "Priority Support",
      "SSO",
    ],
    prices: {
      monthly: {
        amount: 29,
        priceId: "price_pro_monthly",
      },
      yearly: {
        amount: 23, // 20% off roughly
        priceId: "price_pro_yearly",
      },
    },
  },
];
