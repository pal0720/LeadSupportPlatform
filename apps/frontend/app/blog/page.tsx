"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, Clock, Search, ArrowRight, TrendingUp, Mail } from "lucide-react";

const blogPosts = [
  {
    slug: "ai-agents-customer-lifecycle",
    title: "How 7 AI Agents Can Transform Your Customer Lifecycle",
    excerpt: "Discover how specialized AI agents working 24/7 can revolutionize every stage of your customer journey, from first touch to expansion.",
    author: "Sarah Johnson",
    authorAvatar: "SJ",
    date: "2024-11-10",
    readTime: "12 min read",
    category: "AI",
    featured: true,
    image: "gradient-blue-purple",
  },
  {
    slug: "multimodal-content-generation",
    title: "The Future of Content: AI-Generated Text, Images, and Video",
    excerpt: "Learn how our multimodal AI creates personalized emails, social posts, images, and videos at scale—transforming content marketing forever.",
    author: "Michael Chen",
    authorAvatar: "MC",
    date: "2024-11-08",
    readTime: "10 min read",
    category: "Marketing",
    featured: false,
    image: "gradient-purple-pink",
  },
  {
    slug: "multi-tenant-saas-security",
    title: "Building Secure Multi-Tenant SaaS: Best Practices",
    excerpt: "A comprehensive guide to data isolation, encryption, and compliance in multi-tenant SaaS platforms. Learn from our production architecture.",
    author: "Emily Rodriguez",
    authorAvatar: "ER",
    date: "2024-11-05",
    readTime: "15 min read",
    category: "Product Updates",
    featured: false,
    image: "gradient-green-blue",
  },
  {
    slug: "marketing-automation-roi",
    title: "How Marketing Automation Increased Our ROI by 300%",
    excerpt: "Real numbers, real strategies. See exactly how we used AI-powered marketing automation to triple our marketing ROI in 6 months.",
    author: "David Kim",
    authorAvatar: "DK",
    date: "2024-11-03",
    readTime: "8 min read",
    category: "Marketing",
    featured: false,
    image: "gradient-orange-red",
  },
  {
    slug: "crm-migration-guide",
    title: "Migrating to an AI-First CRM: A Complete Guide",
    excerpt: "Step-by-step guide to migrating from Salesforce or HubSpot to an AI-first CRM. Includes data migration, team training, and ROI timelines.",
    author: "Jessica Taylor",
    authorAvatar: "JT",
    date: "2024-10-30",
    readTime: "14 min read",
    category: "Sales",
    featured: false,
    image: "gradient-indigo-purple",
  },
  {
    slug: "ai-lead-scoring",
    title: "AI-Powered Lead Scoring: Science Behind the Magic",
    excerpt: "How machine learning models analyze hundreds of signals to predict which leads will convert. Plus: our lead scoring framework.",
    author: "Robert Martinez",
    authorAvatar: "RM",
    date: "2024-10-28",
    readTime: "11 min read",
    category: "AI",
    featured: false,
    image: "gradient-cyan-blue",
  },
  {
    slug: "customer-success-ai",
    title: "Predicting Churn 90 Days in Advance with AI",
    excerpt: "Our Success Agent uses behavioral signals, usage patterns, and engagement data to predict churn before it happens. Here's how.",
    author: "Sarah Johnson",
    authorAvatar: "SJ",
    date: "2024-10-25",
    readTime: "9 min read",
    category: "Customer Success",
    featured: false,
    image: "gradient-pink-red",
  },
  {
    slug: "sales-autopilot-guide",
    title: "Setting Up Your AI Sales Autopilot: Complete Guide",
    excerpt: "Configure your autonomous AI sales agent to engage leads, book meetings, and nurture prospects 24/7. No supervision required.",
    author: "Michael Chen",
    authorAvatar: "MC",
    date: "2024-10-22",
    readTime: "13 min read",
    category: "Sales",
    featured: false,
    image: "gradient-yellow-orange",
  },
  {
    slug: "b2b-saas-metrics",
    title: "The 15 B2B SaaS Metrics That Actually Matter",
    excerpt: "Beyond MRR and churn: the metrics that predict long-term success for B2B SaaS companies. Plus our Analytics Agent dashboard.",
    author: "Emily Rodriguez",
    authorAvatar: "ER",
    date: "2024-10-20",
    readTime: "10 min read",
    category: "Product Updates",
    featured: false,
    image: "gradient-teal-green",
  },
  {
    slug: "personalization-at-scale",
    title: "Personalization at Scale: How AI Makes It Possible",
    excerpt: "Create unique, personalized experiences for thousands of customers simultaneously. AI personalization techniques that actually work.",
    author: "David Kim",
    authorAvatar: "DK",
    date: "2024-10-18",
    readTime: "7 min read",
    category: "Marketing",
    featured: false,
    image: "gradient-purple-indigo",
  },
  {
    slug: "support-agent-automation",
    title: "How Our Support Agent Reduced Response Times by 80%",
    excerpt: "Intelligent ticket routing, auto-responses, and escalation logic that transformed our support operations. Plus implementation tips.",
    author: "Jessica Taylor",
    authorAvatar: "JT",
    date: "2024-10-15",
    readTime: "12 min read",
    category: "Customer Success",
    featured: false,
    image: "gradient-blue-teal",
  },
  {
    slug: "api-first-platform",
    title: "Building an API-First Platform: Lessons Learned",
    excerpt: "Why we chose an API-first architecture and how it enables our customers to build custom integrations and workflows.",
    author: "Robert Martinez",
    authorAvatar: "RM",
    date: "2024-10-12",
    readTime: "11 min read",
    category: "Product Updates",
    featured: false,
    image: "gradient-red-orange",
  },
];

const categories = ["All", "AI", "Marketing", "Sales", "Customer Success", "Product Updates"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              GTM Platform Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Insights, strategies, and best practices for AI-driven customer lifecycle management
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Post */}
            {featuredPost && selectedCategory === "All" && !searchQuery && (
              <div className="mb-16">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  FEATURED POST
                </div>
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {/* Regular Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
              </h2>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No articles found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {regularPosts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
              <Mail className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get the latest articles, insights, and product updates delivered to your inbox weekly.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                Subscribe
              </button>
            </div>

            {/* Popular Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Popular Posts
              </h3>
              <div className="space-y-6">
                {blogPosts.slice(0, 5).map((post, index) => (
                  <PopularPostItem key={post.slug} post={post} index={index + 1} />
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.filter((c) => c !== "All").map((category) => {
                  const count = blogPosts.filter((p) => p.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">{category}</span>
                      <span className="text-gray-500 dark:text-gray-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedPostCard({ post }: { post: typeof blogPosts[0] }) {
  const gradients = {
    "gradient-blue-purple": "from-blue-500 to-purple-600",
    "gradient-purple-pink": "from-purple-500 to-pink-600",
    "gradient-green-blue": "from-green-500 to-blue-600",
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all border border-gray-200 dark:border-gray-700">
        <div className={`aspect-video bg-gradient-to-br ${gradients[post.image as keyof typeof gradients] || gradients["gradient-blue-purple"]}`}></div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.authorAvatar}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{post.author}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogPostCard({ post }: { post: typeof blogPosts[0] }) {
  const gradients = {
    "gradient-blue-purple": "from-blue-500 to-purple-600",
    "gradient-purple-pink": "from-purple-500 to-pink-600",
    "gradient-green-blue": "from-green-500 to-blue-600",
    "gradient-orange-red": "from-orange-500 to-red-600",
    "gradient-indigo-purple": "from-indigo-500 to-purple-600",
    "gradient-cyan-blue": "from-cyan-500 to-blue-600",
    "gradient-pink-red": "from-pink-500 to-red-600",
    "gradient-yellow-orange": "from-yellow-500 to-orange-600",
    "gradient-teal-green": "from-teal-500 to-green-600",
    "gradient-purple-indigo": "from-purple-500 to-indigo-600",
    "gradient-blue-teal": "from-blue-500 to-teal-600",
    "gradient-red-orange": "from-red-500 to-orange-600",
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
        <div className={`aspect-video bg-gradient-to-br ${gradients[post.image as keyof typeof gradients] || gradients["gradient-blue-purple"]}`}></div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold uppercase">
              {post.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {post.authorAvatar}
              </div>
              <span className="text-gray-700 dark:text-gray-300">{post.author}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PopularPostItem({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex gap-4 group">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
        {index}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
          {post.title}
        </h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </div>
    </Link>
  );
}
