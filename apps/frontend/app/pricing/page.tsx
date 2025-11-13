import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small teams getting started",
    features: [
      { name: "Up to 1,000 leads", included: true },
      { name: "2 team members", included: true },
      { name: "Basic lead scoring", included: true },
      { name: "Email sequences", included: true },
      { name: "Support ticketing", included: true },
      { name: "Basic analytics", included: true },
      { name: "AI features", included: false },
      { name: "Advanced integrations", included: false },
      { name: "Custom playbooks", included: false },
    ],
    cta: "Start Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    description: "For growing teams that need more power",
    features: [
      { name: "Up to 10,000 leads", included: true },
      { name: "10 team members", included: true },
      { name: "AI lead scoring", included: true },
      { name: "Email sequences", included: true },
      { name: "Support ticketing", included: true },
      { name: "Advanced analytics", included: true },
      { name: "AI features", included: true },
      { name: "CRM integrations", included: true },
      { name: "Custom playbooks", included: false },
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams with custom needs",
    features: [
      { name: "Unlimited leads", included: true },
      { name: "Unlimited team members", included: true },
      { name: "AI lead scoring", included: true },
      { name: "Email sequences", included: true },
      { name: "Support ticketing", included: true },
      { name: "Advanced analytics", included: true },
      { name: "All AI features", included: true },
      { name: "All integrations", included: true },
      { name: "Custom playbooks", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the plan that fits your team. Start with a 14-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={\`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 \${
                plan.popular
                  ? "border-blue-600 scale-105"
                  : "border-gray-200 dark:border-gray-700"
              }\`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                  )}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.price === "Custom" ? "/contact" : "/register"}
                className={\`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors \${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                }\`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
