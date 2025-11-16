import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Workflow,
  Target,
  BarChart3,
  Globe,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Zap,
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

export default function MarketingAutomationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white py-24">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">
              Marketing Automation Powered by AI
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Build sophisticated customer journeys, generate multi-channel content at scale, and measure
              every campaign with AI-powered marketing automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Builder */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Workflow className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Visual Journey Builder
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Create complex customer journeys with a drag-and-drop interface. No code required.
                Trigger campaigns based on behavior, demographics, or custom events.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <JourneyFeature
                icon={<Target className="h-6 w-6" />}
                title="Behavioral Triggers"
                description="Launch journeys based on website visits, email opens, form fills, or product usage"
              />
              <JourneyFeature
                icon={<Workflow className="h-6 w-6" />}
                title="A/B Testing"
                description="Test different paths, content, and timing to optimize conversion rates"
              />
              <JourneyFeature
                icon={<Zap className="h-6 w-6" />}
                title="Smart Wait Times"
                description="AI determines optimal send times based on recipient behavior patterns"
              />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 border border-green-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Sample Journey: New Lead Nurture</h3>
              <div className="space-y-6">
                <JourneyStep step="1" action="Lead fills form" description="Trigger: Form submission on pricing page" />
                <JourneyStep step="2" action="Wait 5 minutes" description="AI-optimized wait time" />
                <JourneyStep step="3" action="Send welcome email" description="Personalized content from Content Agent" />
                <JourneyStep step="4" action="Wait 2 days" description="Branch: Opened? Yes/No" />
                <JourneyStep step="5" action="Send product demo video" description="If opened: Educational content" />
                <JourneyStep step="6" action="Book meeting" description="Call-to-action based on engagement score" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Channel Content Generation */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                AI-Powered Multimodal Content Generation
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Generate emails, social posts, images, and videos automatically. Our Content Generation Agent
                creates personalized content at scale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ContentType
                icon={<Mail className="h-8 w-8" />}
                title="Email Campaigns"
                description="Personalized subject lines, body copy, and CTAs for each recipient"
                color="blue"
              />
              <ContentType
                icon={<MessageSquare className="h-8 w-8" />}
                title="Social Media"
                description="LinkedIn, Twitter, Facebook posts optimized for each platform"
                color="purple"
              />
              <ContentType
                icon={<ImageIcon className="h-8 w-8" />}
                title="Images & Graphics"
                description="AI-generated visuals, infographics, and custom imagery"
                color="pink"
              />
              <ContentType
                icon={<Video className="h-8 w-8" />}
                title="Video Content"
                description="Product demos, explainer videos, and personalized video messages"
                color="orange"
              />
            </div>

            <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Content Generation Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ContentFeature text="Personalization tokens (name, company, industry, etc.)" />
                <ContentFeature text="Multi-language support (40+ languages)" />
                <ContentFeature text="Brand voice and tone customization" />
                <ContentFeature text="A/B test variant generation" />
                <ContentFeature text="SEO optimization for blogs and landing pages" />
                <ContentFeature text="Compliance checking (GDPR, CAN-SPAM)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Management */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Campaign Management Made Simple
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Create, launch, and manage campaigns across email, social, SMS, and more from one central platform.
                </p>
                <ul className="space-y-4">
                  <CampaignFeature text="Multi-channel campaign orchestration" />
                  <CampaignFeature text="Campaign templates and playbooks" />
                  <CampaignFeature text="Audience segmentation and targeting" />
                  <CampaignFeature text="Send-time optimization" />
                  <CampaignFeature text="Spam testing and deliverability checks" />
                  <CampaignFeature text="Campaign scheduling and automation" />
                </ul>
              </div>
              <div className="space-y-4">
                <CampaignCard
                  name="Product Launch"
                  channels={["Email", "LinkedIn", "Twitter"]}
                  audience="5,234 contacts"
                  status="Active"
                  opens="42%"
                />
                <CampaignCard
                  name="Customer Onboarding"
                  channels={["Email", "In-App"]}
                  audience="892 contacts"
                  status="Active"
                  opens="68%"
                />
                <CampaignCard
                  name="Win-Back Campaign"
                  channels={["Email", "SMS"]}
                  audience="3,421 contacts"
                  status="Scheduled"
                  opens="-"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Reporting */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Analytics & Attribution
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Track every metric that matters. Understand which campaigns drive revenue.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <MetricCard metric="Email Engagement" value="Open, click, reply rates" />
              <MetricCard metric="Multi-Touch Attribution" value="Track full customer journey" />
              <MetricCard metric="ROI Tracking" value="Revenue per campaign" />
              <MetricCard metric="Predictive Analytics" value="AI forecasts campaign performance" />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Real-Time Campaign Dashboard</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <DashboardStat label="Emails Sent" value="127,543" change="+12%" positive />
                <DashboardStat label="Open Rate" value="42.3%" change="+5.2%" positive />
                <DashboardStat label="Revenue Generated" value="$89,430" change="+18%" positive />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Ecosystem */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Globe className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Integrated Marketing Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Connect with your favorite marketing tools and sync data seamlessly
            </p>
            <div className="grid md:grid-cols-5 gap-8">
              {["Mailchimp", "Zapier", "Segment", "Google Analytics", "Facebook Ads", "LinkedIn Ads", "Shopify", "WordPress", "Stripe", "Salesforce"].map((tool) => (
                <div key={tool} className="text-gray-500 dark:text-gray-400 font-semibold">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Automate Your Marketing?
            </h2>
            <p className="text-2xl text-green-100 mb-12">
              Join thousands of marketers using AI to scale their campaigns. Start free today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl text-white mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function JourneyStep({ step, action, description }: { step: string; action: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
        {step}
      </div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white">{action}</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">{description}</div>
      </div>
    </div>
  );
}

function ContentType({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    pink: "from-pink-600 to-pink-400",
    orange: "from-orange-600 to-orange-400",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function ContentFeature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

function CampaignFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </li>
  );
}

function CampaignCard({ name, channels, audience, status, opens }: { name: string; channels: string[]; audience: string; status: string; opens: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">{audience}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Active" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
          {status}
        </span>
      </div>
      <div className="flex gap-2 mb-3">
        {channels.map((channel) => (
          <span key={channel} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
            {channel}
          </span>
        ))}
      </div>
      <div className="text-sm">
        <span className="text-gray-600 dark:text-gray-400">Open Rate: </span>
        <span className="font-bold text-gray-900 dark:text-white">{opens}</span>
      </div>
    </div>
  );
}

function MetricCard({ metric, value }: { metric: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-bold text-gray-900 dark:text-white mb-2">{metric}</div>
      <div className="text-gray-600 dark:text-gray-300 text-sm">{value}</div>
    </div>
  );
}

function DashboardStat({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      <div className={`text-sm font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
        {change}
      </div>
    </div>
  );
}
