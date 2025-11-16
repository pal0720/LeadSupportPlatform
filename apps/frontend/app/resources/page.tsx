import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Video,
  FileText,
  Users,
  Calculator,
  Download,
  Code,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  Zap,
  Globe,
  Play,
} from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Resources to Help You Succeed
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Everything you need to master the platform, from documentation to video tutorials,
              templates, and calculators. All free.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Access
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Jump to the resources you need most
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <QuickLink
                icon={<BookOpen className="h-8 w-8" />}
                title="Documentation"
                description="Complete guides and API reference"
                href="#documentation"
                color="blue"
              />
              <QuickLink
                icon={<Video className="h-8 w-8" />}
                title="Video Tutorials"
                description="Step-by-step video walkthroughs"
                href="#videos"
                color="purple"
              />
              <QuickLink
                icon={<FileText className="h-8 w-8" />}
                title="Templates"
                description="Ready-to-use email and journey templates"
                href="#templates"
                color="green"
              />
              <QuickLink
                icon={<Calculator className="h-8 w-8" />}
                title="ROI Calculator"
                description="Calculate your potential savings"
                href="#calculator"
                color="orange"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div id="documentation" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <BookOpen className="h-12 w-12 text-blue-600" />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Documentation
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive guides to help you get the most out of the platform
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <DocCard
                title="Getting Started"
                description="New to the platform? Start here for onboarding guides and quick wins."
                topics={[
                  "Account setup",
                  "First campaign",
                  "Team invitation",
                  "Data import"
                ]}
              />
              <DocCard
                title="Feature Guides"
                description="Deep dives into each feature, with examples and best practices."
                topics={[
                  "AI Agents",
                  "CRM & Pipelines",
                  "Marketing Automation",
                  "Analytics & Reporting"
                ]}
              />
              <DocCard
                title="Developer Docs"
                description="API reference, webhooks, and integration guides for developers."
                topics={[
                  "REST API",
                  "Webhooks",
                  "Custom integrations",
                  "SDKs"
                ]}
              />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Browse All Documentation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <div id="videos" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Video className="h-12 w-12 text-purple-600" />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Video Tutorials
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch and learn from our expert-led video series
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <VideoCard
                title="Platform Overview (15 min)"
                description="A complete tour of the platform and its key features"
                duration="15:24"
                views="12.5K"
              />
              <VideoCard
                title="Setting Up Your First AI Agent (10 min)"
                description="Step-by-step guide to deploying your first AI agent"
                duration="10:18"
                views="8.2K"
              />
              <VideoCard
                title="Building Customer Journeys (20 min)"
                description="Create sophisticated multi-channel customer journeys"
                duration="19:45"
                views="9.8K"
              />
              <VideoCard
                title="CRM Best Practices (12 min)"
                description="How to structure your pipelines and manage deals effectively"
                duration="12:33"
                views="7.1K"
              />
              <VideoCard
                title="Marketing Automation Deep Dive (25 min)"
                description="Advanced marketing automation strategies and tactics"
                duration="24:56"
                views="6.4K"
              />
              <VideoCard
                title="Analytics & Reporting (18 min)"
                description="Master the analytics dashboard and custom reports"
                duration="17:42"
                views="5.9K"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div id="templates" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <FileText className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Templates & Playbooks
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Pre-built templates to accelerate your implementation
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TemplateCard
                title="Welcome Email Sequence"
                category="Email"
                description="5-email onboarding sequence for new customers"
                downloads="3.2K"
              />
              <TemplateCard
                title="Product Launch Journey"
                category="Journey"
                description="Complete multi-channel campaign for product launches"
                downloads="2.8K"
              />
              <TemplateCard
                title="Sales Follow-up Templates"
                category="Email"
                description="10 proven follow-up email templates"
                downloads="5.1K"
              />
              <TemplateCard
                title="Churn Prevention Playbook"
                category="Playbook"
                description="Automated workflow to reduce customer churn"
                downloads="1.9K"
              />
              <TemplateCard
                title="Lead Nurture Campaign"
                category="Journey"
                description="30-day nurture journey for cold leads"
                downloads="4.3K"
              />
              <TemplateCard
                title="Customer Success QBR Template"
                category="Template"
                description="Quarterly business review presentation template"
                downloads="2.1K"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div id="calculator" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calculator className="h-16 w-16 text-orange-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ROI Calculator
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Calculate how much you could save by switching to our platform
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 border border-blue-200 dark:border-gray-700">
              <div className="space-y-6">
                <CalculatorMetric
                  label="Number of team members using CRM/Marketing tools"
                  example="e.g., 10 sales reps + 5 marketers = 15"
                />
                <CalculatorMetric
                  label="Current monthly spend on tools (Salesforce, HubSpot, etc.)"
                  example="e.g., $5,000/month"
                />
                <CalculatorMetric
                  label="Average hours per week spent on manual tasks"
                  example="e.g., 20 hours across team"
                />
              </div>

              <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border-4 border-green-600">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Annual Savings</div>
                  <div className="text-6xl font-bold text-green-600 mb-4">$127,400</div>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <div className="flex justify-between">
                      <span>Tool consolidation savings:</span>
                      <span className="font-bold">$48,000/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Automation time savings:</span>
                      <span className="font-bold">$62,400/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Increased conversion (conservative):</span>
                      <span className="font-bold">$17,000/year</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Customer Success Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See how companies like yours achieved results
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <CaseStudyCard
                company="TechCorp"
                industry="B2B SaaS"
                result="3x revenue growth in 12 months"
                metric="Revenue Growth"
              />
              <CaseStudyCard
                company="GrowthHub"
                industry="E-commerce"
                result="280% increase in CLV"
                metric="Customer Value"
              />
              <CaseStudyCard
                company="MarketPro"
                industry="Agency"
                result="10x client capacity with same team"
                metric="Operational Efficiency"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Community & Support */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Community & Support
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get help from our team and connect with other users
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <SupportCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="Community Forum"
                description="Ask questions, share tips, and learn from other users"
                link="/community"
                linkText="Visit Forum"
              />
              <SupportCard
                icon={<HelpCircle className="h-8 w-8" />}
                title="Help Center"
                description="Search our knowledge base for instant answers"
                link="/help"
                linkText="Browse Articles"
              />
              <SupportCard
                icon={<Globe className="h-8 w-8" />}
                title="Live Webinars"
                description="Join weekly webinars on features and best practices"
                link="/webinars"
                linkText="View Schedule"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-blue-100 mb-12">
              Access all these resources and more with a free trial
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:shadow-2xl transition-all font-semibold text-lg"
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

function QuickLink({ icon, title, description, href, color }: { icon: React.ReactNode; title: string; description: string; href: string; color: string }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    green: "from-green-600 to-green-400",
    orange: "from-orange-600 to-orange-400",
  };

  return (
    <a href={href} className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </a>
  );
}

function DocCard({ title, description, topics }: { title: string; description: string; topics: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {topics.map((topic, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoCard({ title, description, duration, views }: { title: string; description: string; duration: string; views: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow group">
      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <Play className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
      </div>
      <div className="p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{duration}</span>
          <span>{views} views</span>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ title, category, description, downloads }: { title: string; category: string; description: string; downloads: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
        <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
      <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold mb-3">
        {category}
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
      <div className="text-sm text-gray-500 dark:text-gray-400">{downloads} downloads</div>
    </div>
  );
}

function CalculatorMetric({ label, example }: { label: string; example: string }) {
  return (
    <div>
      <label className="block font-semibold text-gray-900 dark:text-white mb-2">{label}</label>
      <input
        type="text"
        placeholder={example}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      />
    </div>
  );
}

function CaseStudyCard({ company, industry, result, metric }: { company: string; industry: string; result: string; metric: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-blue-600 dark:text-blue-400 font-bold mb-2">{industry}</div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{company}</h3>
      <div className="text-3xl font-bold text-green-600 mb-2">{result}</div>
      <div className="text-gray-600 dark:text-gray-300">{metric}</div>
    </div>
  );
}

function SupportCard({ icon, title, description, link, linkText }: { icon: React.ReactNode; title: string; description: string; link: string; linkText: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <Link href={link} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
        {linkText} →
      </Link>
    </div>
  );
}
