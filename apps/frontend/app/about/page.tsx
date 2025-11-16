import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Target,
  Users,
  Lightbulb,
  Shield,
  Zap,
  Globe,
  Award,
  TrendingUp,
  BookOpen,
  Code,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              We're Building the Future of Customer Lifecycle Management
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Our mission is to democratize enterprise-grade AI for every company,
              making sophisticated customer engagement accessible to businesses of all sizes.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Empowering Every Business with AI
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that every company, regardless of size, should have access to the same
                AI-powered tools that Fortune 500 companies use. Our platform levels the playing field,
                giving startups and SMBs the power to compete with enterprise capabilities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <MissionCard
                icon={<Heart className="h-8 w-8" />}
                title="Customer-First"
                description="We build for our customers, not for vanity metrics. Every feature solves a real problem."
              />
              <MissionCard
                icon={<Zap className="h-8 w-8" />}
                title="Innovation"
                description="We push the boundaries of AI to create features that didn't exist yesterday."
              />
              <MissionCard
                icon={<Users className="h-8 w-8" />}
                title="Accessibility"
                description="Enterprise power at startup prices. AI should be available to everyone."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                How We Started
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                In 2022, our founders were running a fast-growing SaaS company and struggling with
                a common problem: they needed Salesforce, HubSpot, Intercom, Zendesk, and a dozen
                other tools just to manage their customer lifecycle. Each tool cost thousands per
                month, required separate training, and created data silos.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                They realized there had to be a better way. What if one platform could do it all?
                What if AI could automate 80% of the manual work? What if it was affordable enough
                for any company to use?
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                That's when GTM Platform was born. We started with a simple vision: create the most
                powerful, most affordable, most AI-driven customer lifecycle platform on the market.
                Today, we're helping thousands of companies across 50+ countries transform how they
                acquire, engage, and retain customers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <StoryMilestone year="2022" title="Founded" description="Platform launched in beta" />
              <StoryMilestone year="2023" title="1,000 Customers" description="Hit first major milestone" />
              <StoryMilestone year="2024" title="Global Expansion" description="Now in 50+ countries" />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Our Values
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What We Stand For
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                These principles guide everything we do, from product development to customer support
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <ValueCard
                icon={<Lightbulb className="h-10 w-10" />}
                title="Continuous Innovation"
                description="We ship new AI features every week. The platform you use today will be even better tomorrow. We're constantly pushing the boundaries of what's possible with AI and automation."
                color="blue"
              />
              <ValueCard
                icon={<Users className="h-10 w-10" />}
                title="Customer Obsession"
                description="Every feature request is reviewed. Every bug is prioritized. Every customer email gets a response within 24 hours. Your success is our success."
                color="purple"
              />
              <ValueCard
                icon={<Shield className="h-10 w-10" />}
                title="Trust & Security"
                description="Your data is sacred. We're SOC 2 compliant, GDPR ready, and encrypt everything. We'll never sell your data or train our AI on your customers."
                color="green"
              />
              <ValueCard
                icon={<Globe className="h-10 w-10" />}
                title="Accessibility for All"
                description="Great software shouldn't require a Fortune 500 budget. We price fairly, offer generous free tiers, and provide world-class support to every customer."
                color="orange"
              />
              <ValueCard
                icon={<TrendingUp className="h-10 w-10" />}
                title="Results-Driven"
                description="We measure success by your results, not our feature count. Every feature is designed to directly impact your revenue, retention, or efficiency."
                color="pink"
              />
              <ValueCard
                icon={<Code className="h-10 w-10" />}
                title="Open & Transparent"
                description="We're open about our roadmap, our pricing, and our progress. No hidden fees, no surprise charges, no vendor lock-in."
                color="indigo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Our Team
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Meet the People Building the Future
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                We're a team of engineers, designers, and GTM experts who are passionate about AI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <TeamMember
                name="Alex Chen"
                role="CEO & Co-Founder"
                bio="Former VP Engineering at Salesforce. Built GTM systems for 1,000+ enterprise customers."
                initials="AC"
                color="blue"
              />
              <TeamMember
                name="Sarah Martinez"
                role="CTO & Co-Founder"
                bio="PhD in Machine Learning from Stanford. Led AI research at Google for 8 years."
                initials="SM"
                color="purple"
              />
              <TeamMember
                name="David Kim"
                role="Head of Product"
                bio="Former Product Lead at HubSpot. Shipped features used by millions."
                initials="DK"
                color="green"
              />
              <TeamMember
                name="Emily Rodriguez"
                role="Head of Engineering"
                bio="Ex-Amazon Principal Engineer. Scaled systems to billions of requests."
                initials="ER"
                color="orange"
              />
              <TeamMember
                name="Michael Johnson"
                role="Head of Design"
                bio="Award-winning designer. Previously at Airbnb and Stripe."
                initials="MJ"
                color="pink"
              />
              <TeamMember
                name="Jessica Lee"
                role="Head of Customer Success"
                bio="15 years in SaaS. Helped 500+ companies transform their GTM motion."
                initials="JL"
                color="indigo"
              />
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Plus 50+ engineers, designers, and customer success professionals across 12 countries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-semibold">
                Our Vision
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              The Future of Customer Engagement is Autonomous
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We envision a world where AI agents handle 90% of customer interactions, freeing humans
              to focus on strategy, creativity, and complex problem-solving. Where every company, from
              one-person startups to Fortune 500 enterprises, has access to the same powerful AI tools.
            </p>
            <p className="text-xl text-blue-100">
              We're not there yet, but we're getting closer every day. Join us on the journey.
            </p>
          </div>
        </div>
      </div>

      {/* Investors/Backers */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Backed By The Best
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Investors & Partners
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                We're proud to be backed by leading venture capital firms and strategic partners
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-12 mb-12">
              {["Sequoia Capital", "a16z", "Y Combinator", "Accel Partners", "Lightspeed Ventures", "Tiger Global"].map((investor) => (
                <div key={investor} className="text-2xl font-bold text-gray-400">
                  {investor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Press & Media */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                In The News
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what people are saying about us
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <PressCard
                publication="TechCrunch"
                headline="GTM Platform Raises $50M to Democratize AI-Driven Customer Engagement"
                date="January 2024"
              />
              <PressCard
                publication="Forbes"
                headline="The Startups Disrupting Traditional CRM with AI"
                date="December 2023"
              />
              <PressCard
                publication="VentureBeat"
                headline="How AI is Transforming the Customer Lifecycle"
                date="November 2023"
              />
              <PressCard
                publication="The Information"
                headline="GTM Platform Hits $100M ARR in Record Time"
                date="October 2023"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center border border-blue-200 dark:border-gray-700">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Join Our Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                We're always looking for talented people who are passionate about AI and customer success.
                Check out our open positions and help us build the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  View Open Positions
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 transition-all font-semibold"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function StoryMilestone({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{year}</div>
      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</div>
      <div className="text-gray-600 dark:text-gray-300">{description}</div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
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
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

function TeamMember({
  name,
  role,
  bio,
  initials,
  color,
}: {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    green: "from-green-600 to-green-400",
    orange: "from-orange-600 to-orange-400",
    pink: "from-pink-600 to-pink-400",
    indigo: "from-indigo-600 to-indigo-400",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg text-center">
      <div className={`w-24 h-24 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}>
        {initials}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
      <div className="text-blue-600 dark:text-blue-400 font-semibold mb-3">{role}</div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{bio}</p>
    </div>
  );
}

function PressCard({ publication, headline, date }: { publication: string; headline: string; date: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-blue-600 dark:text-blue-400 font-bold mb-2">{publication}</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{headline}</h3>
      <div className="text-sm text-gray-500 dark:text-gray-400">{date}</div>
    </div>
  );
}
