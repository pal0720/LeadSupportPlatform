import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  Briefcase,
  Rocket,
  Building2,
  Target,
  DollarSign,
  Clock,
  BarChart3,
  Star,
  ShoppingCart,
  Globe,
  Shield,
} from "lucide-react";

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Built for Every Industry, Optimized for Growth
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              See how companies across industries are using our AI-driven platform
              to transform their customer lifecycle management and accelerate revenue growth.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* B2B SaaS Use Case */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  B2B SaaS Companies
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Accelerate Sales Cycles and Scale Revenue
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                SaaS companies need to move fast, acquire customers efficiently, and reduce churn.
                Our platform helps you do all three with AI-powered automation across the entire customer journey.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Long sales cycles eating into CAC"
                  solution="AI lead scoring identifies high-intent prospects and automated sequences move them through the funnel 3x faster"
                />
                <UseCaseChallenge
                  title="Manual outreach doesn't scale"
                  solution="Sales Autopilot engages hundreds of leads simultaneously with personalized, multi-channel sequences"
                />
                <UseCaseChallenge
                  title="High churn rates impacting LTV"
                  solution="Success Agent predicts churn 30 days in advance and triggers automated retention workflows"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="3x" label="Faster Sales Cycles" />
                <MetricCard number="45%" label="Higher Win Rates" />
                <MetricCard number="60%" label="Less Manual Work" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for SaaS
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<Target className="h-6 w-6 text-blue-600" />}
                  title="AI Lead Scoring & Enrichment"
                  description="Automatically score and enrich leads based on product fit, intent signals, and engagement"
                />
                <FeatureItem
                  icon={<Zap className="h-6 w-6 text-purple-600" />}
                  title="Product-Led Growth Automation"
                  description="Trigger sequences based on product usage, feature adoption, and user behavior"
                />
                <FeatureItem
                  icon={<BarChart3 className="h-6 w-6 text-green-600" />}
                  title="Revenue Analytics"
                  description="Track MRR, ARR, churn, expansion revenue, and customer health in real-time"
                />
                <FeatureItem
                  icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                  title="Expansion Opportunity Detection"
                  description="AI identifies upsell and cross-sell opportunities based on usage patterns"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    TC
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Sarah Johnson</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">VP of Sales, TechCorp</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "We went from 20 SQLs per month to 65 in just 60 days. The AI lead scoring alone
                  saved our team 15 hours per week, and the automated sequences are converting at 18%."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-commerce Use Case */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for E-commerce
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
                  title="Cart Abandonment Recovery"
                  description="AI-powered sequences that recover 30%+ of abandoned carts with personalized incentives"
                />
                <FeatureItem
                  icon={<Target className="h-6 w-6 text-purple-600" />}
                  title="Customer Lifecycle Journeys"
                  description="Automated post-purchase, replenishment, and win-back campaigns"
                />
                <FeatureItem
                  icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                  title="Personalized Recommendations"
                  description="AI suggests products based on browsing history, purchase patterns, and lookalike customers"
                />
                <FeatureItem
                  icon={<Star className="h-6 w-6 text-orange-600" />}
                  title="Review & Loyalty Automation"
                  description="Automatically request reviews, reward loyalty, and turn customers into advocates"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    GH
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Michael Chen</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">CMO, GrowthHub</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Our customer lifetime value increased 280% in 6 months. The AI-driven
                  replenishment reminders and personalized product recommendations are game-changers."
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  E-commerce Brands
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Maximize Customer Lifetime Value
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                E-commerce is all about repeat purchases and customer retention. Our platform
                helps you create personalized experiences that turn one-time buyers into loyal brand advocates.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Low repeat purchase rates"
                  solution="AI-powered customer journeys trigger personalized campaigns at optimal times to drive repurchases"
                />
                <UseCaseChallenge
                  title="High cart abandonment (70%+)"
                  solution="Intelligent recovery sequences with dynamic discounting recover 30%+ of abandoned carts"
                />
                <UseCaseChallenge
                  title="Generic marketing messages"
                  solution="Content Generation Agent creates personalized emails, SMS, and ads for each customer segment"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="280%" label="CLV Increase" />
                <MetricCard number="50%" label="Repeat Purchases" />
                <MetricCard number="90%" label="Retention Rate" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Use Case */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Marketing Agencies
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Manage Multiple Clients at Scale
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Agencies need to deliver results for dozens of clients without scaling headcount.
                Our multi-tenant platform lets you manage unlimited clients with AI automation.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Can't scale beyond 10-15 clients"
                  solution="Multi-tenant architecture lets you manage 100+ clients from one platform with isolated data"
                />
                <UseCaseChallenge
                  title="Client reporting takes days"
                  solution="AI generates custom reports, QBRs, and performance summaries automatically"
                />
                <UseCaseChallenge
                  title="Manual campaign creation"
                  solution="Content Generation Agent creates campaigns, emails, and assets for all clients in minutes"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="10x" label="Client Capacity" />
                <MetricCard number="0" label="New Hires Needed" />
                <MetricCard number="95%" label="Client Satisfaction" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for Agencies
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  title="Multi-Tenant Client Management"
                  description="Completely isolated workspaces for each client with white-label capabilities"
                />
                <FeatureItem
                  icon={<Zap className="h-6 w-6 text-purple-600" />}
                  title="Campaign Templates"
                  description="Save and reuse successful campaigns across clients with AI customization"
                />
                <FeatureItem
                  icon={<BarChart3 className="h-6 w-6 text-green-600" />}
                  title="Unified Reporting Dashboard"
                  description="See performance across all clients in one view, drill down to individual accounts"
                />
                <FeatureItem
                  icon={<Globe className="h-6 w-6 text-orange-600" />}
                  title="White-Label Platform"
                  description="Rebrand the entire platform with your agency's logo, colors, and domain"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    DK
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">David Kim</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Founder & CEO, MarketPro Agency</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "We went from 12 clients to 85 without hiring a single new person. The multi-tenant
                  setup and AI automation handle everything. This platform literally 10x'd our agency."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Services */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for Professional Services
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<Briefcase className="h-6 w-6 text-blue-600" />}
                  title="Client Relationship Management"
                  description="Track every interaction, project, and touchpoint across your entire client portfolio"
                />
                <FeatureItem
                  icon={<Clock className="h-6 w-6 text-purple-600" />}
                  title="Project Milestone Tracking"
                  description="Automated updates, status reports, and milestone notifications"
                />
                <FeatureItem
                  icon={<DollarSign className="h-6 w-6 text-green-600" />}
                  title="Proposal & Contract Automation"
                  description="AI generates proposals, SOWs, and contracts based on your templates"
                />
                <FeatureItem
                  icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                  title="Referral & Testimonial Automation"
                  description="Automatically request referrals and testimonials at key milestones"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    JT
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Jessica Taylor</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Managing Partner, Legal Advisors LLP</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Client communication has never been easier. The automated status updates and
                  milestone tracking keep everyone informed, and we've seen a 40% increase in referrals."
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
                <Briefcase className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  Professional Services
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Streamline Client Management and Communication
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Whether you're in legal, consulting, accounting, or advisory services, keeping clients
                informed and engaged is critical. Our platform automates communication and project tracking.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Clients want constant updates"
                  solution="Automated milestone notifications and project status reports keep clients informed without manual effort"
                />
                <UseCaseChallenge
                  title="Proposal creation takes days"
                  solution="AI generates customized proposals and SOWs in minutes using your past successful templates"
                />
                <UseCaseChallenge
                  title="Referrals are inconsistent"
                  solution="Automated referral requests triggered at project completion drive consistent new business"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="40%" label="More Referrals" />
                <MetricCard number="70%" label="Time Saved" />
                <MetricCard number="100%" label="Client Visibility" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Startups */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6">
                <Rocket className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                  Tech Startups
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Growth Hacking on Autopilot
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Startups need to move fast with limited resources. Our platform gives you enterprise-grade
                marketing, sales, and support capabilities from day one.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Limited marketing budget and team"
                  solution="AI agents handle lead gen, outreach, and nurturing automatically - no team required"
                />
                <UseCaseChallenge
                  title="Need to show traction to investors"
                  solution="Built-in analytics and reporting provide investor-ready metrics and growth dashboards"
                />
                <UseCaseChallenge
                  title="Can't afford enterprise tools"
                  solution="All-in-one platform replaces 10+ tools at a fraction of the cost"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="$50K+" label="Tool Savings/Year" />
                <MetricCard number="5x" label="Faster Growth" />
                <MetricCard number="24/7" label="AI Coverage" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for Startups
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<Rocket className="h-6 w-6 text-blue-600" />}
                  title="Product-Led Growth Engine"
                  description="Trigger campaigns based on product usage, feature adoption, and engagement signals"
                />
                <FeatureItem
                  icon={<DollarSign className="h-6 w-6 text-purple-600" />}
                  title="Investor Reporting"
                  description="Automated reports on key metrics: MRR, growth rate, CAC, LTV, retention"
                />
                <FeatureItem
                  icon={<Zap className="h-6 w-6 text-green-600" />}
                  title="Growth Hacking Automation"
                  description="Run viral loops, referral programs, and growth experiments with AI optimization"
                />
                <FeatureItem
                  icon={<Target className="h-6 w-6 text-orange-600" />}
                  title="MVP to Scale Support"
                  description="Start with basic features, unlock advanced AI as you grow"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    RS
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Rachel Singh</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Co-Founder, AI Ventures</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "This platform is perfect for early-stage startups. We replaced Salesforce, HubSpot,
                  Intercom, and 5 other tools. Saved $50K/year and 5x'd our lead volume."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features for Enterprise
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  icon={<Shield className="h-6 w-6 text-blue-600" />}
                  title="Enterprise Security & Compliance"
                  description="SOC 2, GDPR, HIPAA compliance with advanced encryption and access controls"
                />
                <FeatureItem
                  icon={<Building2 className="h-6 w-6 text-purple-600" />}
                  title="Custom Integrations"
                  description="Connect to your existing tech stack: Salesforce, SAP, Oracle, custom systems"
                />
                <FeatureItem
                  icon={<Users className="h-6 w-6 text-green-600" />}
                  title="Dedicated Success Team"
                  description="Onboarding specialists, CSMs, and 24/7 priority support"
                />
                <FeatureItem
                  icon={<Globe className="h-6 w-6 text-orange-600" />}
                  title="Global Deployment"
                  description="Multi-region deployment, data residency, and localization support"
                />
              </ul>

              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    RI
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Robert Ince</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">CRO, RevOps Inc (Fortune 500)</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "We needed a platform that could handle our scale, security requirements, and complex
                  workflows. This platform delivered on all fronts. 10,000+ users across 50 countries."
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Enterprise Organizations
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Enterprise-Grade Scale, Security, and Support
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Large organizations need a platform that can handle massive scale, meet strict compliance
                requirements, and integrate with existing systems. We're built for enterprise from day one.
              </p>

              <div className="space-y-6 mb-8">
                <UseCaseChallenge
                  title="Legacy systems causing inefficiencies"
                  solution="Modern API-first architecture integrates with Salesforce, SAP, Oracle, and custom systems"
                />
                <UseCaseChallenge
                  title="Complex compliance requirements"
                  solution="SOC 2, GDPR, HIPAA compliant with audit trails, encryption, and data residency options"
                />
                <UseCaseChallenge
                  title="Global deployment challenges"
                  solution="Multi-region infrastructure with localization support for 40+ languages"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard number="10K+" label="Users Supported" />
                <MetricCard number="99.9%" label="Uptime SLA" />
                <MetricCard number="50+" label="Countries" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expected ROI Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Expected ROI Across All Industries
            </h2>
            <p className="text-xl text-blue-100">
              Companies using our platform see measurable results within the first 30 days
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <ROICard
              metric="3-5x"
              label="Increase in Lead Volume"
              description="AI lead generation and enrichment capture more opportunities"
            />
            <ROICard
              metric="45%+"
              label="Higher Conversion Rates"
              description="AI-powered personalization drives better engagement"
            />
            <ROICard
              metric="60%"
              label="Reduction in Manual Work"
              description="Automation frees your team to focus on high-value activities"
            />
            <ROICard
              metric="$50K+"
              label="Annual Tool Savings"
              description="Replace 10+ tools with one unified platform"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Industry?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              See how our AI-driven platform can accelerate growth for your specific use case.
              Start your free 14-day trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 transition-all font-semibold text-lg"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UseCaseChallenge({ title, solution }: { title: string; solution: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
        </div>
      </div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">{solution}</div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">{description}</div>
      </div>
    </div>
  );
}

function MetricCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{number}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function ROICard({
  metric,
  label,
  description,
}: {
  metric: string;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
      <div className="text-5xl font-bold text-white mb-2">{metric}</div>
      <div className="text-xl font-semibold text-white mb-2">{label}</div>
      <div className="text-sm text-blue-100">{description}</div>
    </div>
  );
}
