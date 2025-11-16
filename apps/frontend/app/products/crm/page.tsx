import Link from "next/link";
import {
  ArrowRight,
  Users,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Zap,
  Target,
  CheckCircle2,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">
              CRM Built for Modern Revenue Teams
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Manage your entire sales pipeline, track every customer interaction, and close deals faster
              with our AI-powered CRM. Beautiful, intuitive, and incredibly powerful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need in a Modern CRM
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Powerful features that help you manage relationships and close deals faster
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Contact & Company Management"
                description="Store unlimited contacts and companies with custom fields, tags, and relationship mapping. See the complete organizational hierarchy."
                color="blue"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Visual Pipeline Management"
                description="Drag-and-drop kanban boards for each pipeline stage. Customize stages, probabilities, and automation rules."
                color="purple"
              />
              <FeatureCard
                icon={<Activity className="h-8 w-8" />}
                title="Activity Timeline"
                description="See every email, call, meeting, and note in one unified timeline. Never lose context on any customer."
                color="green"
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Task & Calendar Management"
                description="Create tasks, set reminders, schedule meetings, and sync with Google/Outlook calendars automatically."
                color="orange"
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Sales Analytics & Forecasting"
                description="Real-time dashboards, pipeline reports, win/loss analysis, and AI-powered revenue forecasting."
                color="pink"
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Workflow Automation"
                description="Automate repetitive tasks like lead assignment, follow-up reminders, and status updates with visual workflows."
                color="indigo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Management Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Visual Pipeline Management
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  See your entire sales pipeline at a glance. Drag deals between stages, track probabilities,
                  and identify bottlenecks instantly.
                </p>
                <ul className="space-y-4">
                  <BenefitItem text="Customizable pipeline stages for your sales process" />
                  <BenefitItem text="Weighted pipeline forecasting based on stage probabilities" />
                  <BenefitItem text="Deal aging alerts to prevent stalled opportunities" />
                  <BenefitItem text="Multi-pipeline support for different product lines" />
                  <BenefitItem text="Automated stage progression based on activities" />
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <PipelineStage name="Qualified" count={12} value="$450K" color="blue" />
                  <PipelineStage name="Demo Scheduled" count={8} value="$320K" color="purple" />
                  <PipelineStage name="Proposal Sent" count={5} value="$180K" color="green" />
                  <PipelineStage name="Negotiation" count={3} value="$110K" color="orange" />
                  <PipelineStage name="Closed Won" count={15} value="$890K" color="pink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tracking */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Unified Activity Timeline
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Every customer interaction automatically logged and visible in one place. Know exactly
                  what happened and what's next.
                </p>
                <ul className="space-y-4">
                  <BenefitItem text="Automatic email logging from Gmail/Outlook" />
                  <BenefitItem text="Call recording and transcription" />
                  <BenefitItem text="Meeting notes and summaries" />
                  <BenefitItem text="File attachments and proposals" />
                  <BenefitItem text="Custom activity types and fields" />
                </ul>
              </div>
              <div className="lg:order-1 space-y-4">
                <ActivityItem
                  icon={<Mail className="h-5 w-5" />}
                  type="Email Sent"
                  description="Product Demo Follow-up"
                  time="2 hours ago"
                  color="blue"
                />
                <ActivityItem
                  icon={<Phone className="h-5 w-5" />}
                  type="Call Completed"
                  description="Discovery Call - 45 minutes"
                  time="Yesterday"
                  color="green"
                />
                <ActivityItem
                  icon={<Calendar className="h-5 w-5" />}
                  type="Meeting Scheduled"
                  description="Product Demo with CEO"
                  time="Tomorrow at 2pm"
                  color="purple"
                />
                <ActivityItem
                  icon={<FileText className="h-5 w-5" />}
                  type="Proposal Sent"
                  description="Q1 2024 Enterprise Plan"
                  time="3 days ago"
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CRM */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Mobile CRM for On-the-Go
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Full CRM functionality on iOS and Android. Update deals, log activities, and check dashboards
              from anywhere.
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              <MobileFeature title="Offline Mode" description="Work without internet, sync when connected" />
              <MobileFeature title="Voice Notes" description="Dictate meeting notes hands-free" />
              <MobileFeature title="Push Notifications" description="Never miss an important update" />
              <MobileFeature title="Business Card Scanner" description="Scan cards, create contacts instantly" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Globe className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Integrates With Your Entire Tech Stack
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Connect to 100+ tools and sync data automatically
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <IntegrationCategory
                title="Email & Calendar"
                tools={["Gmail", "Outlook", "Office 365", "Google Calendar"]}
              />
              <IntegrationCategory
                title="Communication"
                tools={["Slack", "Microsoft Teams", "Zoom", "Calendly"]}
              />
              <IntegrationCategory
                title="Marketing & Sales"
                tools={["HubSpot", "Mailchimp", "LinkedIn", "Zapier"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Lock className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Your customer data is protected with military-grade encryption and comprehensive compliance
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              <SecurityBadge title="SOC 2 Certified" />
              <SecurityBadge title="GDPR Compliant" />
              <SecurityBadge title="256-bit Encryption" />
              <SecurityBadge title="99.9% Uptime SLA" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Sales Process?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Join thousands of teams using our CRM to close more deals. Start your free trial today.
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
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 transition-all font-semibold text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    green: "from-green-600 to-green-400",
    orange: "from-orange-600 to-orange-400",
    pink: "from-pink-600 to-pink-400",
    indigo: "from-indigo-600 to-indigo-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </li>
  );
}

function PipelineStage({ name, count, value, color }: { name: string; count: number; value: string; color: string }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-sm opacity-75">{count} deals</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, type, description, time, color }: { icon: React.ReactNode; type: string; description: string; time: string; color: string }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    purple: "from-purple-600 to-purple-400",
    orange: "from-orange-600 to-orange-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex items-start gap-4">
      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-bold text-gray-900 dark:text-white">{type}</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">{description}</div>
        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{time}</div>
      </div>
    </div>
  );
}

function MobileFeature({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function IntegrationCategory({ title, tools }: { title: string; tools: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {tools.map((tool) => (
          <li key={tool} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-gray-700 dark:text-gray-300">{tool}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecurityBadge({ title }: { title: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
      <div className="font-bold text-lg">{title}</div>
    </div>
  );
}
