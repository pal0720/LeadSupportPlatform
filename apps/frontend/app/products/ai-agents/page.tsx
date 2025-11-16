import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  Target,
  Zap,
  FileText,
  LifeBuoy,
  TrendingUp,
  MessageSquare,
  PieChart,
  Sparkles,
  CheckCircle2,
  Play,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-semibold">7 Specialized AI Agents</span>
            </div>
            <h1 className="text-6xl font-bold mb-6">
              Your AI-Powered Revenue Team Working 24/7
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Seven specialized AI agents that handle lead generation, sales, support, and customer success automatically.
              Each trained on millions of interactions to deliver enterprise-grade results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why AI Agents */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why AI Agents?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Your team can't work 24/7, but AI agents can. They never sleep, never take vacation,
                and handle thousands of tasks simultaneously with perfect consistency.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <BenefitCard
                icon={<Clock className="h-8 w-8" />}
                title="24/7 Operation"
                description="Never miss a lead or support ticket, even outside business hours"
              />
              <BenefitCard
                icon={<Zap className="h-8 w-8" />}
                title="Instant Response"
                description="Respond to inquiries in seconds, not hours or days"
              />
              <BenefitCard
                icon={<DollarSign className="h-8 w-8" />}
                title="Massive Scale"
                description="Handle 1,000x the volume without hiring more people"
              />
              <BenefitCard
                icon={<Brain className="h-8 w-8" />}
                title="Always Learning"
                description="AI improves with every interaction, getting smarter over time"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agent 1: Lead Enrichment Agent */}
      <AgentDetailSection
        name="Lead Enrichment Agent"
        tagline="Transform Raw Leads into Rich Prospect Profiles"
        description="Automatically enriches every lead with company data, social profiles, funding information, technology stack, and behavioral signals. Know everything about your prospects before your first outreach."
        icon={<Target className="h-12 w-12" />}
        color="blue"
        features={[
          "Company data enrichment (revenue, size, industry, location)",
          "Contact information (email, phone, LinkedIn)",
          "Technology stack detection (what tools they use)",
          "Funding & financial data (from Crunchbase, PitchBook)",
          "Social media profile aggregation",
          "Behavioral intent signals (website visits, content downloads)",
          "Firmographic and demographic scoring",
          "Real-time data updates and verification"
        ]}
        useCases={[
          "Sales teams need complete prospect profiles before outreach",
          "Marketing wants to segment leads based on company data",
          "SDRs need to personalize outreach at scale"
        ]}
        metrics={[
          { label: "Data Accuracy", value: "95%" },
          { label: "Enrichment Speed", value: "<5 sec" },
          { label: "Data Points", value: "50+" }
        ]}
        reverse={false}
      />

      {/* Agent 2: Sales Autopilot */}
      <AgentDetailSection
        name="Sales Autopilot"
        tagline="Fully Autonomous Lead Engagement"
        description="Your AI sales rep that engages leads, qualifies prospects, books meetings, and nurtures opportunities through personalized multi-channel sequences. Works 24/7 without supervision."
        icon={<Zap className="h-12 w-12" />}
        color="green"
        features={[
          "Autonomous lead engagement via email, LinkedIn, SMS",
          "AI-powered personalization for each prospect",
          "Intelligent follow-up timing and cadence",
          "Automatic meeting booking and calendar integration",
          "Objection handling and FAQ responses",
          "Lead scoring and qualification",
          "Pipeline progression automation",
          "Handoff to human reps when needed"
        ]}
        useCases={[
          "Startups with limited sales resources",
          "High-volume outbound campaigns",
          "Lead nurturing and re-engagement"
        ]}
        metrics={[
          { label: "Response Rate", value: "3-5x" },
          { label: "Meetings Booked", value: "Auto" },
          { label: "Cost vs SDR", value: "90% less" }
        ]}
        reverse={true}
      />

      {/* Agent 3: Content Generation Agent */}
      <AgentDetailSection
        name="Content Generation Agent"
        tagline="Multimodal AI Content at Scale"
        description="Creates personalized emails, social posts, blog articles, images, and videos tailored to each prospect or customer. Generate thousands of unique, high-quality content pieces in minutes."
        icon={<FileText className="h-12 w-12" />}
        color="purple"
        features={[
          "Personalized email copywriting",
          "Social media posts (LinkedIn, Twitter, Facebook)",
          "Blog articles and long-form content",
          "AI-generated images and graphics",
          "Video creation and editing",
          "Landing page copy",
          "Ad copy and creative",
          "Multi-language support (40+ languages)"
        ]}
        useCases={[
          "Marketing teams creating campaign content",
          "Sales reps personalizing outreach",
          "Customer success creating QBRs and reports"
        ]}
        metrics={[
          { label: "Content Quality", value: "Human-level" },
          { label: "Generation Time", value: "Seconds" },
          { label: "Cost Savings", value: "80%" }
        ]}
        reverse={false}
      />

      {/* Agent 4: Support Agent */}
      <AgentDetailSection
        name="Support Agent"
        tagline="Intelligent 24/7 Customer Support"
        description="AI-powered support that routes tickets, provides instant answers, escalates complex issues, and learns from every interaction. Deliver enterprise-grade support without a massive team."
        icon={<LifeBuoy className="h-12 w-12" />}
        color="orange"
        features={[
          "Intelligent ticket routing and prioritization",
          "Automated responses to common questions",
          "Knowledge base search and suggestions",
          "Multi-channel support (email, chat, social)",
          "Sentiment analysis and escalation",
          "SLA monitoring and enforcement",
          "Proactive issue detection",
          "Conversation summarization"
        ]}
        useCases={[
          "Support teams overwhelmed with volume",
          "Companies wanting 24/7 coverage",
          "Reducing response times and costs"
        ]}
        metrics={[
          { label: "Response Time", value: "80% faster" },
          { label: "Resolution Rate", value: "70%" },
          { label: "CSAT Score", value: "4.8/5" }
        ]}
        reverse={true}
      />

      {/* Agent 5: Success Agent */}
      <AgentDetailSection
        name="Success Agent"
        tagline="Predictive Customer Success Management"
        description="Predicts churn before it happens, identifies expansion opportunities, automates health scoring, and generates executive business reviews. Turn every customer into a growing account."
        icon={<TrendingUp className="h-12 w-12" />}
        color="pink"
        features={[
          "Churn prediction (30-90 days in advance)",
          "Customer health scoring",
          "Expansion opportunity identification",
          "Usage analytics and insights",
          "Automated QBR generation",
          "Renewal risk alerts",
          "Success plan creation",
          "ROI calculation and reporting"
        ]}
        useCases={[
          "SaaS companies reducing churn",
          "CSMs managing large portfolios",
          "Identifying upsell opportunities"
        ]}
        metrics={[
          { label: "Churn Reduction", value: "35%" },
          { label: "Expansion Revenue", value: "+28%" },
          { label: "CSM Efficiency", value: "3x" }
        ]}
        reverse={false}
      />

      {/* Agent 6: Live Co-Pilot */}
      <AgentDetailSection
        name="Live Co-Pilot"
        tagline="Real-Time AI Assistance During Calls"
        description="Your AI assistant that listens to sales calls, support conversations, and meetings in real-time, providing instant suggestions, objection handlers, and next-step recommendations."
        icon={<MessageSquare className="h-12 w-12" />}
        color="indigo"
        features={[
          "Real-time call transcription",
          "Live suggestions during conversations",
          "Objection handling recommendations",
          "Competitor intelligence lookup",
          "Pricing and product information",
          "Next-step recommendations",
          "Meeting notes and summaries",
          "Action item extraction"
        ]}
        useCases={[
          "Sales reps closing complex deals",
          "Support agents handling difficult customers",
          "Customer success in QBR meetings"
        ]}
        metrics={[
          { label: "Win Rate Increase", value: "+40%" },
          { label: "Call Quality", value: "+55%" },
          { label: "Onboarding Time", value: "50% less" }
        ]}
        reverse={true}
      />

      {/* Agent 7: Analytics Agent */}
      <AgentDetailSection
        name="Analytics Agent"
        tagline="Natural Language Business Intelligence"
        description="Ask questions in plain English and get instant insights from all your customer data. Predictive models, custom dashboards, and automated reporting without SQL or data science skills."
        icon={<PieChart className="h-12 w-12" />}
        color="cyan"
        features={[
          "Natural language queries ('Show me at-risk customers')",
          "Predictive analytics and forecasting",
          "Custom dashboard creation",
          "Automated report generation",
          "Anomaly detection",
          "Trend analysis and insights",
          "Multi-source data integration",
          "Real-time metrics and KPIs"
        ]}
        useCases={[
          "Executives needing instant insights",
          "Teams without data analysts",
          "Forecasting and planning"
        ]}
        metrics={[
          { label: "Query Speed", value: "Instant" },
          { label: "Accuracy", value: "98%" },
          { label: "Time Saved", value: "10 hrs/week" }
        ]}
        reverse={false}
      />

      {/* How Agents Work Together */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Agents Work Together as a Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The real magic happens when all 7 agents collaborate. They share data, coordinate actions,
                and create a seamless experience across the entire customer lifecycle.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-8">
                <OrchestrationStep
                  step="1"
                  agents={["Lead Enrichment Agent"]}
                  description="New lead comes in → Enrichment Agent gathers all company and contact data"
                />
                <OrchestrationStep
                  step="2"
                  agents={["Analytics Agent"]}
                  description="Analytics Agent scores the lead based on fit and intent signals"
                />
                <OrchestrationStep
                  step="3"
                  agents={["Content Generation Agent", "Sales Autopilot"]}
                  description="Content Agent creates personalized email → Sales Autopilot sends multi-channel sequence"
                />
                <OrchestrationStep
                  step="4"
                  agents={["Live Co-Pilot"]}
                  description="Meeting booked → Co-Pilot provides real-time suggestions during the call"
                />
                <OrchestrationStep
                  step="5"
                  agents={["Success Agent"]}
                  description="Customer converts → Success Agent monitors health and identifies expansion opportunities"
                />
                <OrchestrationStep
                  step="6"
                  agents={["Support Agent"]}
                  description="Support Agent handles questions and escalates when needed"
                />
                <OrchestrationStep
                  step="7"
                  agents={["Analytics Agent"]}
                  description="Analytics Agent provides insights and predictions for the entire lifecycle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              AI Agent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              All plans include access to AI agents. Higher tiers unlock more agents and advanced features.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <PricingTier
                name="Starter"
                price="$99"
                agentCount="3 Agents"
                agents={["Lead Enrichment", "Content Generation", "Analytics"]}
              />
              <PricingTier
                name="Professional"
                price="$299"
                agentCount="7 Agents"
                agents={["All Starter agents", "+ Sales Autopilot", "+ Support Agent", "+ Success Agent", "+ Live Co-Pilot"]}
                highlighted={true}
              />
              <PricingTier
                name="Enterprise"
                price="Custom"
                agentCount="All Agents"
                agents={["All 7 agents", "Custom training", "Dedicated support", "White-label"]}
              />
            </div>

            <div className="mt-12">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg"
              >
                View Full Pricing Details
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Deploy Your AI Revenue Team?
            </h2>
            <p className="text-2xl text-blue-100 mb-12">
              Start your 14-day free trial and see how 7 AI agents can transform your business.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function AgentDetailSection({
  name,
  tagline,
  description,
  icon,
  color,
  features,
  useCases,
  metrics,
  reverse,
}: {
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  useCases: string[];
  metrics: { label: string; value: string }[];
  reverse: boolean;
}) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    purple: "from-purple-600 to-purple-400",
    orange: "from-orange-600 to-orange-400",
    pink: "from-pink-600 to-pink-400",
    indigo: "from-indigo-600 to-indigo-400",
    cyan: "from-cyan-600 to-cyan-400",
  };

  const bgColor = reverse ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900";

  return (
    <div className={`py-24 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto ${reverse ? "lg:flex-row-reverse" : ""}`}>
          <div className={reverse ? "lg:order-2" : ""}>
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl text-white mb-6`}>
              {icon}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{name}</h2>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-6">{tagline}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{description}</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={reverse ? "lg:order-1" : ""}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Perfect For:</h3>
              <ul className="space-y-2">
                {useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrchestrationStep({
  step,
  agents,
  description,
}: {
  step: string;
  agents: string[];
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {step}
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {agents.map((agent, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
              {agent}
            </span>
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

function PricingTier({
  name,
  price,
  agentCount,
  agents,
  highlighted = false,
}: {
  name: string;
  price: string;
  agentCount: string;
  agents: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg ${highlighted ? "ring-4 ring-blue-600 transform scale-105" : "border border-gray-200 dark:border-gray-700"}`}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{price}</div>
      <div className="text-gray-600 dark:text-gray-400 mb-6">{agentCount}</div>
      <ul className="space-y-3">
        {agents.map((agent, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{agent}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
