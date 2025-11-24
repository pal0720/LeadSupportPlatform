"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

// Sample blog post data - in production, this would come from a CMS or database
const blogPostsData: Record<string, any> = {
  "ai-agents-customer-lifecycle": {
    title: "How 7 AI Agents Can Transform Your Customer Lifecycle",
    content: `
# How 7 AI Agents Can Transform Your Customer Lifecycle

In today's fast-paced business environment, managing the customer lifecycle efficiently is crucial for success. Our platform leverages 7 specialized AI agents that work 24/7 to revolutionize every stage of your customer journey.

## The 7 AI Agents

### 1. Lead Engagement Agent
This agent automatically qualifies and engages with new leads, responding to inquiries within seconds and booking meetings when appropriate.

### 2. Outbound Sales Agent
Autonomously conducts personalized outreach campaigns, following up with prospects and nurturing relationships until they're ready to buy.

### 3. Content Generation Agent
Creates personalized emails, social posts, images, and videos tailored to each prospect's industry, role, and pain points.

### 4. Deal Progression Agent
Monitors active deals and proactively suggests next steps, identifies risks, and recommends strategies to move deals forward.

### 5. Customer Support Agent
Provides instant, accurate responses to customer queries, escalating complex issues to human agents when necessary.

### 6. Customer Success Agent
Tracks product usage, identifies at-risk customers, and proactively reaches out to prevent churn before it happens.

### 7. Expansion Agent
Identifies upsell and cross-sell opportunities based on usage patterns and engagement signals.

## Real Results

Companies using our AI agent platform have seen:
- 3x increase in lead response time
- 50% reduction in sales cycle length
- 40% improvement in customer retention
- 2x increase in expansion revenue

## Getting Started

Ready to transform your customer lifecycle? Start with one agent and expand as you see results. Our platform makes it easy to configure, deploy, and monitor your AI workforce.
    `,
    author: "Sarah Johnson",
    authorAvatar: "SJ",
    date: "2024-11-10",
    readTime: "12 min read",
    category: "AI",
    image: "gradient-blue-purple",
  },
  "multimodal-content-generation": {
    title: "The Future of Content: AI-Generated Text, Images, and Video",
    content: `
# The Future of Content: AI-Generated Text, Images, and Video

Content creation has evolved dramatically. Our multimodal AI platform can generate personalized text, images, and videos at scale—transforming how businesses approach content marketing.

## Multimodal AI Capabilities

### Text Generation
Our AI creates compelling copy for emails, blog posts, social media, and more. Each piece is tailored to your brand voice and audience.

### Image Generation
Generate custom images for campaigns, social posts, and presentations without stock photo libraries or expensive designers.

### Video Creation
Produce personalized video messages at scale. Perfect for sales outreach, customer onboarding, and marketing campaigns.

## Use Cases

1. **Personalized Email Campaigns**: Generate unique email content and visuals for each segment
2. **Social Media Automation**: Create a week's worth of posts in minutes
3. **Sales Enablement**: Produce personalized sales materials for each prospect
4. **Customer Education**: Build training videos and documentation automatically

## ROI Impact

Teams using our content generation platform report:
- 80% reduction in content creation time
- 5x increase in content output
- 60% improvement in engagement rates
- 90% cost savings compared to traditional methods
    `,
    author: "Michael Chen",
    authorAvatar: "MC",
    date: "2024-11-08",
    readTime: "10 min read",
    category: "Marketing",
    image: "gradient-purple-pink",
  },
  "multi-tenant-saas-security": {
    title: "Building Secure Multi-Tenant SaaS: Best Practices",
    content: `
# Building Secure Multi-Tenant SaaS: Best Practices

Security in multi-tenant SaaS platforms is paramount. This guide covers our production architecture for data isolation, encryption, and compliance.

## Data Isolation Strategies

### Row-Level Security
Every query includes workspace_id filtering, ensuring complete data isolation between tenants.

### Encryption at Rest and in Transit
All data is encrypted using AES-256, with TLS 1.3 for data in transit.

### Regular Security Audits
We conduct quarterly penetration tests and security audits to identify and fix vulnerabilities.

## Compliance Framework

- SOC 2 Type II certified
- GDPR compliant
- HIPAA ready architecture
- Regular third-party security assessments

## Best Practices

1. **Never trust client input**: Always validate and sanitize
2. **Use parameterized queries**: Prevent SQL injection
3. **Implement rate limiting**: Protect against abuse
4. **Log everything**: Enable forensic analysis
5. **Rotate credentials**: Automate secret rotation

## Architecture Highlights

Our platform uses PostgreSQL row-level security, Redis for caching, and Celery for background jobs—all within a security-hardened infrastructure.
    `,
    author: "Emily Rodriguez",
    authorAvatar: "ER",
    date: "2024-11-05",
    readTime: "15 min read",
    category: "Product Updates",
    image: "gradient-green-blue",
  },
  "marketing-automation-roi": {
    title: "How Marketing Automation Increased Our ROI by 300%",
    content: `
# How Marketing Automation Increased Our ROI by 300%

Real numbers, real strategies. Here's exactly how we used AI-powered marketing automation to triple our marketing ROI in 6 months.

## The Challenge

Before implementing automation, our marketing team was:
- Spending 20 hours/week on manual email campaigns
- Managing leads inefficiently
- Missing follow-up opportunities
- Unable to personalize at scale

## The Solution

We implemented a comprehensive marketing automation strategy:

### 1. Lead Scoring & Qualification
Automated scoring based on behavior, demographics, and engagement.

### 2. Drip Campaigns
Multi-touch email sequences triggered by specific actions.

### 3. Personalization Engine
Dynamic content based on industry, role, and behavior.

### 4. AI-Powered Optimization
Continuous A/B testing and optimization of subject lines, send times, and content.

## The Results

After 6 months:
- **3x ROI**: From 2:1 to 6:1 return on marketing spend
- **50% time savings**: Team now focuses on strategy, not execution
- **40% increase in MQLs**: More qualified leads entering the pipeline
- **25% improvement in conversion rates**: Better targeting and personalization

## Key Takeaways

1. Start with one workflow and expand
2. Measure everything
3. Continuously optimize based on data
4. Don't automate bad processes—fix them first
    `,
    author: "David Kim",
    authorAvatar: "DK",
    date: "2024-11-03",
    readTime: "8 min read",
    category: "Marketing",
    image: "gradient-orange-red",
  },
  "crm-migration-guide": {
    title: "Migrating to an AI-First CRM: A Complete Guide",
    content: `
# Migrating to an AI-First CRM: A Complete Guide

Thinking about migrating from Salesforce or HubSpot to an AI-first CRM? This guide covers everything you need to know.

## Why Migrate?

Traditional CRMs require manual data entry and lack intelligence. AI-first CRMs:
- Automatically capture and enrich data
- Predict deal outcomes
- Suggest next best actions
- Automate repetitive tasks

## Migration Process

### Phase 1: Planning (Week 1-2)
- Audit current data
- Define migration scope
- Map custom fields
- Plan team training

### Phase 2: Data Migration (Week 3-4)
- Export data from legacy CRM
- Clean and deduplicate
- Import to new platform
- Validate data integrity

### Phase 3: Configuration (Week 5-6)
- Set up workflows
- Configure AI agents
- Integrate tools
- Customize dashboards

### Phase 4: Training & Rollout (Week 7-8)
- Train team members
- Conduct pilot with small group
- Gather feedback
- Full rollout

## Common Challenges

1. **Data Quality**: Clean your data before migration
2. **Change Management**: Get buy-in from all stakeholders
3. **Integration Complexity**: Map all integrations early
4. **Training**: Invest in comprehensive training

## ROI Timeline

- Month 1-2: Stabilization
- Month 3-4: Efficiency gains
- Month 5-6: Revenue impact
- Month 7+: Full ROI realization
    `,
    author: "Jessica Taylor",
    authorAvatar: "JT",
    date: "2024-10-30",
    readTime: "14 min read",
    category: "Sales",
    image: "gradient-indigo-purple",
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPostsData[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const gradients: Record<string, string> = {
    "gradient-blue-purple": "from-blue-600 to-purple-600",
    "gradient-purple-pink": "from-purple-600 to-pink-600",
    "gradient-green-blue": "from-green-600 to-blue-600",
    "gradient-orange-red": "from-orange-600 to-red-600",
    "gradient-indigo-purple": "from-indigo-600 to-purple-600",
    "gradient-cyan-blue": "from-cyan-600 to-blue-600",
    "gradient-pink-red": "from-pink-600 to-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradients[post.image]} text-white py-20`}>
        <div className="container mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <div className="flex items-center text-white/80">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  {post.authorAvatar}
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 -mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
                <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Bookmark className="h-5 w-5" />
                  Bookmark
                </button>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .split('\n')
                    .map((line: string) => {
                      if (line.startsWith('# ')) {
                        return `<h1>${line.substring(2)}</h1>`;
                      } else if (line.startsWith('## ')) {
                        return `<h2>${line.substring(3)}</h2>`;
                      } else if (line.startsWith('### ')) {
                        return `<h3>${line.substring(4)}</h3>`;
                      } else if (line.startsWith('- ')) {
                        return `<li>${line.substring(2)}</li>`;
                      } else if (line.match(/^\d+\./)) {
                        return `<li>${line.substring(line.indexOf('.') + 2)}</li>`;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return `<strong>${line.substring(2, line.length - 2)}</strong>`;
                      } else if (line.trim() === '') {
                        return '<br>';
                      } else {
                        return `<p>${line}</p>`;
                      }
                    })
                    .join(''),
                }}
              />
            </article>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {post.author}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Writer and expert in AI, marketing automation, and customer lifecycle management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to transform your business?</h3>
            <p className="text-blue-100 mb-6">
              Start your free trial today and see the difference AI agents can make.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
