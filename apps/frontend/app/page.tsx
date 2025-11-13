import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Users,
  Mail,
  LifeBuoy,
  TrendingUp,
  Zap,
  Brain,
  Target,
  MessageSquare,
  FileText
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Driven GTM Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Unify lead generation, sales engagement, customer support, and customer success
            with advanced AI automation
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Lead Generation */}
          <FeatureCard
            icon={<Target className="h-8 w-8 text-blue-600" />}
            title="Lead Generation"
            description="Capture, enrich, and score leads automatically with AI-powered intelligence"
            href="/dashboard/leads"
            features={[
              "AI lead scoring",
              "Auto-enrichment",
              "Website tracking",
              "Form capture"
            ]}
          />

          {/* Sales Engagement */}
          <FeatureCard
            icon={<Mail className="h-8 w-8 text-green-600" />}
            title="Sales Engagement"
            description="Multi-channel sequences with AI-generated personalization"
            href="/dashboard/sequences"
            features={[
              "Email sequences",
              "AI email writer",
              "Multi-channel outreach",
              "Reply detection"
            ]}
          />

          {/* Customer Support */}
          <FeatureCard
            icon={<LifeBuoy className="h-8 w-8 text-purple-600" />}
            title="Customer Support"
            description="AI-powered ticket management and auto-responses"
            href="/dashboard/support"
            features={[
              "Smart routing",
              "AI auto-reply",
              "SLA tracking",
              "Knowledge base"
            ]}
          />

          {/* Customer Success */}
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-orange-600" />}
            title="Customer Success"
            description="Predict churn and identify expansion opportunities"
            href="/dashboard/success"
            features={[
              "Health scoring",
              "Churn prediction",
              "Expansion signals",
              "QBR automation"
            ]}
          />

          {/* AI Agents */}
          <FeatureCard
            icon={<Bot className="h-8 w-8 text-indigo-600" />}
            title="AI Agents"
            description="Autonomous agents for sales, support, and success"
            href="/dashboard/ai"
            features={[
              "Sales autopilot",
              "Support agent",
              "Success agent",
              "Live co-pilot"
            ]}
          />

          {/* Analytics */}
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-pink-600" />}
            title="Analytics & Insights"
            description="AI-powered insights and predictive analytics"
            href="/dashboard/analytics"
            features={[
              "Custom dashboards",
              "Predictive models",
              "Natural language BI",
              "Real-time metrics"
            ]}
          />
        </div>

        {/* AI Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            <Brain className="inline-block h-8 w-8 text-blue-600 mr-2" />
            Powered by Advanced AI
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Every feature is enhanced with cutting-edge AI capabilities
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AIFeature
              icon={<Zap className="h-6 w-6" />}
              title="AI Autopilot"
              description="Fully autonomous lead engagement and nurturing"
            />
            <AIFeature
              icon={<MessageSquare className="h-6 w-6" />}
              title="Live Co-Pilot"
              description="Real-time suggestions during calls and meetings"
            />
            <AIFeature
              icon={<FileText className="h-6 w-6" />}
              title="AI QBR Creator"
              description="Auto-generate quarterly business reviews"
            />
            <AIFeature
              icon={<Users className="h-6 w-6" />}
              title="Lookalike Finder"
              description="Find similar prospects using AI"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your GTM Motion?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join forward-thinking companies using AI to scale their revenue operations
          </p>
          <Link
            href="/dashboard"
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

function FeatureCard({
  icon,
  title,
  description,
  href,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  features: string[];
}) {
  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </Link>
  );
}

function AIFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg mb-3">
        {icon}
      </div>
      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
