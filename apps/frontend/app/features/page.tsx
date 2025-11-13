import Link from "next/link";
import { Check, ArrowRight, Target, Mail, LifeBuoy, TrendingUp, Bot, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Lead Generation & Scoring",
    description: "Capture, enrich, and score leads automatically with AI-powered intelligence",
    features: [
      "Embeddable forms and chat widgets",
      "Website activity tracking",
      "Auto-enrichment with firmographics",
      "AI lead scoring (0-100)",
      "Intent signal detection",
      "Progressive profiling",
    ],
  },
  {
    icon: Mail,
    title: "Sales Engagement",
    description: "Multi-channel sequences with AI-generated personalization at scale",
    features: [
      "Email sequence automation",
      "AI email writer & personalization",
      "Multi-channel orchestration",
      "Reply detection & categorization",
      "Send time optimization",
      "A/B testing & analytics",
    ],
  },
  {
    icon: LifeBuoy,
    title: "Customer Support",
    description: "AI-powered ticket management and auto-responses for faster resolution",
    features: [
      "Unified support inbox",
      "AI auto-reply & suggestions",
      "Smart routing & assignment",
      "SLA tracking & alerts",
      "Knowledge base with AI search",
      "Customer portal",
    ],
  },
  {
    icon: TrendingUp,
    title: "Customer Success",
    description: "Predict churn and identify expansion opportunities before they happen",
    features: [
      "Account health scoring",
      "Churn prediction (ML model)",
      "Expansion signal detection",
      "QBR automation",
      "Usage analytics",
      "CS playbooks",
    ],
  },
  {
    icon: Bot,
    title: "AI Agents",
    description: "Autonomous agents that work 24/7 for sales, support, and success",
    features: [
      "AI Sales Autopilot",
      "AI Support Agent",
      "AI Success Agent",
      "Live Co-Pilot for calls",
      "Conversational AI chatbots",
      "1-Click explain any lead/account",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "AI-powered insights and predictive analytics for data-driven decisions",
    features: [
      "Custom dashboards",
      "Predictive models",
      "Natural language BI",
      "Anomaly detection",
      "Real-time metrics",
      "Export & reporting",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Scale Revenue
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Unify lead generation, sales engagement, customer support, and customer success
              with advanced AI automation in one powerful platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your GTM Motion?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ companies using AI to scale their revenue operations
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
