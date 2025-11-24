"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Copy,
  Edit,
  Trash,
  MoreVertical,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  GitBranch,
  Mail,
  MessageSquare,
  Zap,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils/date";

type JourneyStatus = "active" | "paused" | "draft" | "archived";

interface Journey {
  id: string;
  name: string;
  description: string;
  status: JourneyStatus;
  enrollmentCount: number;
  completionRate: number;
  avgCompletionTime: string;
  createdAt: string;
  updatedAt: string;
  steps: number;
  triggers: string[];
}

const initialJourneys: Journey[] = [
  {
    id: "1",
    name: "Welcome & Onboarding",
    description: "Automated onboarding sequence for new leads",
    status: "active",
    enrollmentCount: 1247,
    completionRate: 78,
    avgCompletionTime: "7 days",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    steps: 8,
    triggers: ["New Lead Created", "Form Submission"],
  },
  {
    id: "2",
    name: "Product Demo Follow-up",
    description: "Nurture sequence after product demo",
    status: "active",
    enrollmentCount: 456,
    completionRate: 82,
    avgCompletionTime: "5 days",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-28",
    steps: 5,
    triggers: ["Demo Completed"],
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    description: "Win back inactive leads",
    status: "paused",
    enrollmentCount: 892,
    completionRate: 45,
    avgCompletionTime: "14 days",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
    steps: 6,
    triggers: ["30 Days Inactive"],
  },
  {
    id: "4",
    name: "Customer Success Journey",
    description: "Post-purchase engagement and upsell",
    status: "active",
    enrollmentCount: 234,
    completionRate: 91,
    avgCompletionTime: "30 days",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-29",
    steps: 12,
    triggers: ["Deal Won", "Purchase Complete"],
  },
  {
    id: "5",
    name: "Event Attendee Nurture",
    description: "Follow-up for event attendees",
    status: "draft",
    enrollmentCount: 0,
    completionRate: 0,
    avgCompletionTime: "N/A",
    createdAt: "2024-01-28",
    updatedAt: "2024-01-28",
    steps: 4,
    triggers: ["Event Attended"],
  },
];

const performanceData = [
  { month: "Jan", enrollments: 423, completions: 345 },
  { month: "Feb", enrollments: 512, completions: 421 },
  { month: "Mar", enrollments: 589, completions: 478 },
  { month: "Apr", enrollments: 634, completions: 523 },
  { month: "May", enrollments: 721, completions: 601 },
  { month: "Jun", enrollments: 798, completions: 678 },
];

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>(initialJourneys);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JourneyStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredJourneys = journeys.filter((journey) => {
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || journey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: JourneyStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "archived":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const totalEnrollments = journeys.reduce((sum, j) => sum + j.enrollmentCount, 0);
  const avgCompletionRate = journeys.reduce((sum, j) => sum + j.completionRate, 0) / journeys.filter(j => j.status !== "draft").length;
  const activeJourneys = journeys.filter(j => j.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Journeys</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage automated customer journey workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Journey
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Journeys</p>
            <GitBranch className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeJourneys}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2 this month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEnrollments.toLocaleString()}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+234 this week</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion Rate</p>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgCompletionRate.toFixed(0)}%</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% vs last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">847</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Currently active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search journeys..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as JourneyStatus | "all")}
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredJourneys.map((journey) => (
          <div
            key={journey.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {journey.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(journey.status)}`}>
                      {journey.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{journey.description}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Triggers */}
              <div className="flex flex-wrap gap-2">
                {journey.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {trigger}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Enrollments</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{journey.enrollmentCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{journey.completionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Time</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{journey.avgCompletionTime}</p>
                </div>
              </div>

              {/* Completion Rate Bar */}
              {journey.status !== "draft" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Completion Progress</span>
                    <span className="font-semibold">{journey.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        journey.completionRate >= 80
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : journey.completionRate >= 60
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-red-500 to-pink-500"
                      }`}
                      style={{ width: `${journey.completionRate}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Flow Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">Journey Flow</span>
                  <span>{journey.steps} steps</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center space-x-1">
                    {Array.from({ length: Math.min(journey.steps, 6) }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center">
                          {i === 0 && <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                          {i === 1 && <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                          {i === 2 && <MessageSquare className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                          {i > 2 && <span className="text-xs text-blue-600 dark:text-blue-400">{i + 1}</span>}
                        </div>
                        {i < Math.min(journey.steps, 6) - 1 && (
                          <div className="w-4 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
                        )}
                      </div>
                    ))}
                    {journey.steps > 6 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">+{journey.steps - 6}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Copy className="h-4 w-4 mr-1" />
                  Clone
                </button>
                <button
                  className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    journey.status === "active"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                  }`}
                >
                  {journey.status === "active" ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Updated {formatDate(journey.updatedAt)}</span>
                <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Journey Performance Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} name="Enrollments" />
            <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} name="Completions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Create Journey Modal */}
      {showCreateModal && (
        <CreateJourneyModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateJourneyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Journey</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Journey Name *
            </label>
            <input
              type="text"
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Welcome & Onboarding"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe the purpose of this journey..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entry Trigger *
            </label>
            <select
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a trigger...</option>
              <option value="lead_created">New Lead Created</option>
              <option value="form_submission">Form Submission</option>
              <option value="demo_completed">Demo Completed</option>
              <option value="deal_won">Deal Won</option>
              <option value="inactive">Inactive for X Days</option>
              <option value="tag_added">Tag Added</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Journey Template (Optional)
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Start from scratch</option>
              <option value="welcome">Welcome Series</option>
              <option value="nurture">Lead Nurture</option>
              <option value="reengagement">Re-engagement</option>
              <option value="onboarding">Customer Onboarding</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
