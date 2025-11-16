"use client";

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
  FileText,
  CheckCircle2,
  Sparkles,
  Globe,
  Lock,
  Workflow,
  PieChart,
  Star,
  Award,
  Play,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof */}
      <SocialProof />

      {/* Features Overview */}
      <FeaturesOverview />

      {/* How It Works */}
      <HowItWorks />

      {/* Use Cases Preview */}
      <UseCasesPreview />

      {/* Stats Section */}
      <StatsSection />

      {/* AI Agents Showcase */}
      <AIAgentsShowcase />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Preview */}
      <PricingPreview />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GTM Platform
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products/ai-agents" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              AI Agents
            </Link>
            <Link href="/products/crm" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              CRM
            </Link>
            <Link href="/products/marketing-automation" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Marketing
            </Link>
            <Link href="/use-cases" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Use Cases
            </Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/resources" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                7 AI Agents. One Platform. Infinite Growth.
              </span>
            </div>

            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Transform Every Customer Touchpoint with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}AI-Driven Intelligence
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The only platform that unifies lead generation, sales engagement,
              customer support, and success with 7 specialized AI agents that work
              24/7 to grow your revenue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-2xl transition-all font-semibold text-lg group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 transition-all font-semibold text-lg group"
              >
                <Play className="mr-2 h-5 w-5" />
                Schedule Demo
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              {/* Placeholder for hero image/illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Brain className="h-32 w-32 mx-auto mb-6 opacity-90" />
                  <p className="text-2xl font-bold">AI-Powered Platform Dashboard</p>
                  <p className="text-lg opacity-90 mt-2">Unified customer lifecycle management</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">+347%</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">AI Agents Active</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProof() {
  const companies = [
    "TechCorp", "SalesForce Pro", "GrowthHub", "MarketPro",
    "CloudScale", "AI Ventures", "DataDrive", "RevOps Inc"
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-16 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm uppercase tracking-wider">
          Trusted by leading companies worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {companies.map((company) => (
            <div key={company} className="text-2xl font-bold text-gray-400">
              {company}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturesOverview() {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "AI Lead Generation",
      description: "Automatically capture, enrich, and score leads with AI-powered intelligence. Identify your best opportunities instantly.",
      color: "blue"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Multi-Channel Outreach",
      description: "AI-generated personalized emails, social messages, and follow-ups across every channel your prospects use.",
      color: "green"
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Marketing Automation",
      description: "Build sophisticated customer journeys with AI-powered content generation for email, social, and video.",
      color: "purple"
    },
    {
      icon: <LifeBuoy className="h-8 w-8" />,
      title: "Intelligent Support",
      description: "AI-powered ticket routing, auto-responses, and knowledge base that learns from every interaction.",
      color: "orange"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Customer Success AI",
      description: "Predict churn, identify expansion opportunities, and automate QBRs with AI-driven insights.",
      color: "pink"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "Natural language BI, custom dashboards, and AI predictions that tell you what's coming next.",
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    purple: "from-purple-600 to-purple-400",
    orange: "from-orange-600 to-orange-400",
    pink: "from-pink-600 to-pink-400",
    indigo: "from-indigo-600 to-indigo-400",
  };

  return (
    <div className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Scale Revenue
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A complete platform that covers every stage of the customer lifecycle,
            powered by AI that never sleeps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-transparent hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Data",
      description: "Integrate with your existing CRM, email, and marketing tools in minutes. Our AI immediately starts learning from your data.",
      icon: <Globe className="h-8 w-8" />
    },
    {
      number: "02",
      title: "AI Agents Activate",
      description: "Our 7 specialized AI agents analyze your data, identify opportunities, and start automating workflows across your entire GTM motion.",
      icon: <Bot className="h-8 w-8" />
    },
    {
      number: "03",
      title: "Scale Engagement",
      description: "AI generates personalized content, scores leads, routes support tickets, and predicts customer behavior at scale.",
      icon: <Zap className="h-8 w-8" />
    },
    {
      number: "04",
      title: "Grow Revenue",
      description: "Watch as conversion rates increase, customer satisfaction improves, and your team focuses on high-value activities.",
      icon: <TrendingUp className="h-8 w-8" />
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get up and running in minutes, not months. Our AI does the heavy lifting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full">
                <div className="text-6xl font-bold text-blue-100 dark:text-blue-900/30 mb-4">
                  {step.number}
                </div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UseCasesPreview() {
  const useCases = [
    {
      industry: "B2B SaaS",
      title: "Accelerate Sales Cycles",
      description: "AI-powered lead scoring and personalized outreach helped TechCorp close deals 3x faster and increase win rates by 45%.",
      metrics: ["3x faster sales", "45% higher win rate", "60% less manual work"],
      icon: <Zap className="h-6 w-6" />
    },
    {
      industry: "E-commerce",
      title: "Boost Customer Lifetime Value",
      description: "GrowthHub increased CLV by 280% using AI-driven customer journeys and predictive recommendations.",
      metrics: ["280% CLV increase", "50% repeat purchase rate", "90% retention"],
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      industry: "Agencies",
      title: "Manage Multiple Clients Effortlessly",
      description: "MarketPro scaled from 10 to 100+ clients without adding headcount using our multi-tenant AI platform.",
      metrics: ["10x client capacity", "Zero new hires", "95% client satisfaction"],
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Built for Your Industry
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See how companies like yours are transforming their GTM motion with AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                {useCase.icon}
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {useCase.industry}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {useCase.description}
              </p>
              <div className="space-y-2">
                {useCase.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Explore All Use Cases
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { number: "10M+", label: "Deals Closed", icon: <Target className="h-8 w-8" /> },
    { number: "50M+", label: "AI-Generated Content Pieces", icon: <FileText className="h-8 w-8" /> },
    { number: "500K+", label: "Hours Saved Monthly", icon: <Zap className="h-8 w-8" /> },
    { number: "98%", label: "Customer Satisfaction", icon: <Star className="h-8 w-8" /> },
  ];

  return (
    <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Companies
          </h2>
          <p className="text-xl text-blue-100">
            Our AI-powered platform is transforming how businesses grow revenue
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl text-white mb-4">
                {stat.icon}
              </div>
              <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-xl text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAgentsShowcase() {
  const agents = [
    {
      name: "Lead Enrichment Agent",
      description: "Automatically enriches incoming leads with company data, social profiles, and behavioral signals.",
      icon: <Target className="h-6 w-6" />,
      color: "blue"
    },
    {
      name: "Sales Autopilot",
      description: "Fully autonomous lead engagement with personalized multi-channel sequences and intelligent follow-ups.",
      icon: <Zap className="h-6 w-6" />,
      color: "green"
    },
    {
      name: "Content Generation Agent",
      description: "Creates personalized emails, social posts, images, and videos tailored to each prospect or customer.",
      icon: <FileText className="h-6 w-6" />,
      color: "purple"
    },
    {
      name: "Support Agent",
      description: "Intelligent ticket routing, automated responses, and proactive issue detection for 24/7 support.",
      icon: <LifeBuoy className="h-6 w-6" />,
      color: "orange"
    },
    {
      name: "Success Agent",
      description: "Predicts churn, identifies expansion opportunities, and automates customer health monitoring.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "pink"
    },
    {
      name: "Live Co-Pilot",
      description: "Real-time suggestions during calls, meetings, and customer interactions to drive better outcomes.",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "indigo"
    },
    {
      name: "Analytics Agent",
      description: "Natural language BI, predictive insights, and automated reporting across all customer data.",
      icon: <PieChart className="h-6 w-6" />,
      color: "cyan"
    }
  ];

  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    purple: "from-purple-600 to-purple-400",
    orange: "from-orange-600 to-orange-400",
    pink: "from-pink-600 to-pink-400",
    indigo: "from-indigo-600 to-indigo-400",
    cyan: "from-cyan-600 to-cyan-400",
  };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              7 Specialized AI Agents
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your AI-Powered Revenue Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Each agent is trained on millions of customer interactions and optimized
            for specific outcomes across your GTM motion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-500"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colorClasses[agent.color as keyof typeof colorClasses]} rounded-lg text-white mb-4`}>
                {agent.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {agent.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {agent.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products/ai-agents"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Learn More About AI Agents
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "This platform transformed our sales process. We're closing 3x more deals with the same team size. The AI agents are like having 50 SDRs working 24/7.",
      author: "Sarah Johnson",
      role: "VP of Sales",
      company: "TechCorp",
      avatar: "SJ"
    },
    {
      quote: "The marketing automation and content generation features are incredible. We went from spending weeks on campaign creation to hours. ROI increased 300% in just 3 months.",
      author: "Michael Chen",
      role: "CMO",
      company: "GrowthHub",
      avatar: "MC"
    },
    {
      quote: "Customer support has never been easier. Our response times dropped 80% and satisfaction scores are at an all-time high. The AI routing and auto-responses are magic.",
      author: "Emily Rodriguez",
      role: "Head of Support",
      company: "CloudScale",
      avatar: "ER"
    },
    {
      quote: "We scaled from 10 to 100+ clients without adding headcount. The multi-tenant architecture and AI automation made it possible. This platform paid for itself in week one.",
      author: "David Kim",
      role: "Founder & CEO",
      company: "MarketPro Agency",
      avatar: "DK"
    },
    {
      quote: "The predictive analytics and churn prevention features saved us millions. We can now identify at-risk customers weeks before they show signs of leaving.",
      author: "Jessica Taylor",
      role: "VP of Customer Success",
      company: "DataDrive",
      avatar: "JT"
    },
    {
      quote: "Integration was seamless and we saw results immediately. The AI lead scoring alone increased our conversion rate by 45%. Best investment we've made.",
      author: "Robert Martinez",
      role: "Revenue Operations",
      company: "SalesForce Pro",
      avatar: "RM"
    }
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by Revenue Teams Everywhere
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See what our customers have to say about transforming their GTM motion with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingPreview() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 1,000 contacts",
        "3 AI agents",
        "Basic CRM",
        "Email sequences",
        "Support ticketing",
        "Standard analytics"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "For growing teams that need more power",
      features: [
        "Up to 10,000 contacts",
        "7 AI agents",
        "Advanced CRM",
        "Multi-channel outreach",
        "Marketing automation",
        "Predictive analytics",
        "API access",
        "Priority support"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited contacts",
        "All 7 AI agents",
        "White-label platform",
        "Custom integrations",
        "Dedicated success manager",
        "SLA guarantees",
        "Advanced security",
        "Custom training"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start free, scale as you grow. No hidden fees or surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg ${
                plan.highlighted
                  ? "ring-4 ring-blue-600 transform scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                  <Award className="h-4 w-4" />
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {plan.period}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {plan.description}
              </p>
              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/register"}
                className={`block text-center px-6 py-3 rounded-lg font-semibold mb-8 transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View Detailed Pricing Comparison
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FinalCTA() {
  const [email, setEmail] = useState("");

  return (
    <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Revenue Operations?
          </h2>
          <p className="text-2xl text-blue-100 mb-12">
            Join thousands of companies using AI to scale their GTM motion.
            Start your free 14-day trial today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 rounded-lg w-full sm:w-96 text-gray-900 text-lg"
            />
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg whitespace-nowrap w-full sm:w-auto"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const footerLinks = {
    Product: [
      { name: "AI Agents", href: "/products/ai-agents" },
      { name: "CRM", href: "/products/crm" },
      { name: "Marketing Automation", href: "/products/marketing-automation" },
      { name: "Pricing", href: "/pricing" },
      { name: "Security", href: "/security" },
    ],
    Solutions: [
      { name: "B2B SaaS", href: "/solutions/saas" },
      { name: "E-commerce", href: "/solutions/ecommerce" },
      { name: "Agencies", href: "/solutions/agencies" },
      { name: "Professional Services", href: "/solutions/professional-services" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/resources" },
      { name: "Use Cases", href: "/use-cases" },
      { name: "Help Center", href: "/resources" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GTM Platform</span>
            </Link>
            <p className="text-sm text-gray-400">
              AI-driven customer lifecycle management for modern revenue teams.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 GTM Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
