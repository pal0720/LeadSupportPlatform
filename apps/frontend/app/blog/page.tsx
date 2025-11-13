import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    slug: "ai-lead-scoring-guide",
    title: "The Complete Guide to AI Lead Scoring in 2024",
    excerpt: "Learn how AI-powered lead scoring can increase your conversion rates by 300%.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Lead Generation",
  },
  {
    slug: "sales-automation-best-practices",
    title: "10 Sales Automation Best Practices That Actually Work",
    excerpt: "Discover proven strategies top-performing sales teams use to automate workflows.",
    author: "Mike Chen",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Sales Engagement",
  },
  {
    slug: "customer-support-ai",
    title: "How AI is Transforming Customer Support in 2024",
    excerpt: "See how companies reduce response times by 80% while maintaining satisfaction.",
    author: "Emily Brown",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Customer Support",
  },
];

const categories = ["All", "Lead Generation", "Sales Engagement", "Customer Support", "Customer Success"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              GTM Platform Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Insights, best practices, and trends in sales, marketing, and customer success
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors \${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }\`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.slug}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="font-semibold text-blue-600 uppercase">{post.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(post.date).toLocaleDateString()}
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
