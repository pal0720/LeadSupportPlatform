"use client";

import { useState } from "react";
import {
  Sparkles,
  Brain,
  MessageSquare,
  TrendingUp,
  Mail,
  Target,
  Zap,
  Eye,
  Edit,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  Users,
  FileText,
  Send,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Wand2,
} from "lucide-react";

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  status: "available" | "beta" | "coming-soon";
  usageCount?: number;
  accuracy?: number;
}

const aiTools: AITool[] = [
  {
    id: "lead-scoring",
    name: "AI Lead Scoring",
    description: "Automatically score and prioritize leads based on conversion probability",
    icon: Target,
    category: "Sales",
    status: "available",
    usageCount: 1248,
    accuracy: 94,
  },
  {
    id: "email-writer",
    name: "Email Content Generator",
    description: "Generate personalized email content for outreach campaigns",
    icon: Mail,
    category: "Marketing",
    status: "available",
    usageCount: 892,
    accuracy: 89,
  },
  {
    id: "sentiment",
    name: "Sentiment Analysis",
    description: "Analyze customer sentiment from support tickets and emails",
    icon: MessageSquare,
    category: "Support",
    status: "available",
    usageCount: 564,
    accuracy: 91,
  },
  {
    id: "churn-prediction",
    name: "Churn Prediction",
    description: "Identify accounts at risk of churning before it happens",
    icon: TrendingUp,
    category: "Customer Success",
    status: "beta",
    usageCount: 234,
    accuracy: 87,
  },
  {
    id: "response-suggest",
    name: "Smart Response Suggestions",
    description: "AI-powered suggestions for customer support responses",
    icon: Brain,
    category: "Support",
    status: "available",
    usageCount: 756,
    accuracy: 92,
  },
  {
    id: "content-optimize",
    name: "Content Optimizer",
    description: "Optimize marketing content for better engagement and conversions",
    icon: Wand2,
    category: "Marketing",
    status: "beta",
    usageCount: 423,
    accuracy: 88,
  },
];

export default function AIPage() {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDemo, setShowDemo] = useState(false);

  const filteredTools = aiTools.filter(
    (tool) => categoryFilter === "all" || tool.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-purple-600" />
            AI Features
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Leverage AI to automate tasks and gain insights
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90">AI Tools Active</p>
          <p className="text-3xl font-bold mt-1">{aiTools.filter((t) => t.status === "available").length}</p>
          <p className="text-xs opacity-75 mt-2">{aiTools.length} total tools</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total AI Usage</p>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {aiTools.reduce((sum, tool) => sum + (tool.usageCount || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+23% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Accuracy</p>
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(aiTools.reduce((sum, tool) => sum + (tool.accuracy || 0), 0) / aiTools.length).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Across all models</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Saved</p>
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">284h</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            categoryFilter === "all"
              ? "bg-purple-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          All Tools
        </button>
        {["Sales", "Marketing", "Support", "Customer Success"].map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === category
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <tool.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      {tool.status === "beta" && (
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                          Beta
                        </span>
                      )}
                      {tool.status === "coming-soon" && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 text-xs font-medium rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                </div>
              </div>

              {tool.status !== "coming-soon" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Usage Count</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {tool.usageCount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Accuracy</p>
                    <div className="flex items-baseline">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {tool.accuracy}%
                      </p>
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 ml-1" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowDemo(true);
                  }}
                  disabled={tool.status === "coming-soon"}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {tool.status === "coming-soon" ? "Coming Soon" : "Try Now"}
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent AI Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent AI Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            {
              tool: "AI Lead Scoring",
              action: "Scored 45 new leads",
              time: "5 minutes ago",
              status: "success",
            },
            {
              tool: "Email Content Generator",
              action: "Generated 12 email templates",
              time: "1 hour ago",
              status: "success",
            },
            {
              tool: "Sentiment Analysis",
              action: "Analyzed 28 support tickets",
              time: "2 hours ago",
              status: "success",
            },
            {
              tool: "Churn Prediction",
              action: "Identified 3 at-risk accounts",
              time: "3 hours ago",
              status: "warning",
            },
            {
              tool: "Smart Response Suggestions",
              action: "Provided 67 response suggestions",
              time: "4 hours ago",
              status: "success",
            },
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {activity.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.tool}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && selectedTool && (
        <DemoModal tool={selectedTool} onClose={() => setShowDemo(false)} />
      )}
    </div>
  );
}

function DemoModal({ tool, onClose }: { tool: AITool; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (tool.id === "email-writer") {
      setResult(`Subject: Exclusive Offer for Enterprise Solutions

Hi [Name],

I noticed your company has been growing rapidly in the tech sector, and I wanted to reach out with a solution that could help accelerate that growth even further.

Our enterprise platform has helped companies like yours:
• Increase lead conversion by 40%
• Reduce customer churn by 25%
• Save 15+ hours per week on manual processes

I'd love to show you how we can deliver similar results for [Company Name]. Are you available for a 15-minute call this week?

Best regards,
[Your Name]`);
    } else if (tool.id === "lead-scoring") {
      setResult(`Lead Score Analysis:

Overall Score: 85/100 (High Priority)

Breakdown:
• Engagement Score: 92/100 ✓
• Fit Score: 78/100 ✓
• Intent Score: 88/100 ✓

Key Factors:
✓ Visited pricing page 3 times
✓ Downloaded whitepaper
✓ Company size matches ICP
✓ Budget range confirmed
⚠ No direct contact yet

Recommendation: High priority lead. Reach out within 24 hours for best conversion probability.`);
    } else {
      setResult(`AI analysis complete! The ${tool.name} has processed your request and generated insights based on the latest machine learning models.`);
    }

    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <tool.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Tool</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tool.id === "email-writer" ? "Email Prompt" : "Input Data"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={
                tool.id === "email-writer"
                  ? "Describe the email you want to generate (e.g., 'Cold outreach for enterprise SaaS prospects')"
                  : "Enter the data you want to analyze..."
              }
            />
          </div>

          {!result && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing || !input}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate with AI
                </>
              )}
            </button>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                      AI Generated Result
                    </span>
                  </div>
                  <button className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors">
                    <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">
                  {result}
                </pre>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Was this result helpful?</p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors">
                    <ThumbsUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors">
                    <ThumbsDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setInput("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Try Again
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Use This Result
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
