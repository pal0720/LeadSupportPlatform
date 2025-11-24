"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Mail,
  Clock,
  Users,
  TrendingUp,
  Play,
  Pause,
  Copy,
  Edit,
  Trash,
  X,
  Send,
  Calendar,
  BarChart3,
  Eye,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";

interface Sequence {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  steps: number;
  enrolled: number;
  opened: number;
  replied: number;
  openRate: number;
  replyRate: number;
  createdAt: string;
}

const initialSequences: Sequence[] = [
  {
    id: "1",
    name: "Enterprise Outbound Sequence",
    description: "Multi-touch sequence for enterprise prospects",
    status: "active",
    steps: 5,
    enrolled: 150,
    opened: 112,
    replied: 23,
    openRate: 74.7,
    replyRate: 15.3,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Product Launch Campaign",
    description: "Announcement sequence for new product launch",
    status: "active",
    steps: 3,
    enrolled: 450,
    opened: 387,
    replied: 89,
    openRate: 86.0,
    replyRate: 19.8,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Re-engagement Sequence",
    description: "Win-back campaign for inactive leads",
    status: "paused",
    steps: 4,
    enrolled: 200,
    opened: 134,
    replied: 28,
    openRate: 67.0,
    replyRate: 14.0,
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    name: "Onboarding Welcome Series",
    description: "Automated onboarding emails for new customers",
    status: "active",
    steps: 7,
    enrolled: 320,
    opened: 289,
    replied: 67,
    openRate: 90.3,
    replyRate: 20.9,
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "SMB Outreach Template",
    description: "Cold outreach sequence for SMB segment",
    status: "draft",
    steps: 4,
    enrolled: 0,
    opened: 0,
    replied: 0,
    openRate: 0,
    replyRate: 0,
    createdAt: "2024-01-20",
  },
];

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>(initialSequences);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredSequences = sequences.filter((sequence) => {
    const matchesSearch =
      sequence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sequence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sequence.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const totalEnrolled = sequences.reduce((sum, s) => sum + s.enrolled, 0);
  const totalOpened = sequences.reduce((sum, s) => sum + s.opened, 0);
  const totalReplied = sequences.reduce((sum, s) => sum + s.replied, 0);
  const avgOpenRate = sequences.length > 0
    ? sequences.reduce((sum, s) => sum + s.openRate, 0) / sequences.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Sequences</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage automated email campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Sequence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sequences</p>
            <Zap className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {sequences.filter((s) => s.status === "active").length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sequences.length} total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</p>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEnrolled}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+15% this week</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Open Rate</p>
            <Mail className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {avgOpenRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalOpened} opens
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Replies</p>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalReplied}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8.3% vs last week</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
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
                placeholder="Search sequences..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sequences Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredSequences.map((sequence) => (
          <div
            key={sequence.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {sequence.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sequence.description}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sequence.status)}`}>
                  {sequence.status}
                </span>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {sequence.steps} steps
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {sequence.enrolled} enrolled
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(sequence.createdAt)}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Rate</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sequence.openRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {sequence.opened}/{sequence.enrolled}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reply Rate</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sequence.replyRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {sequence.replied} replies
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Performance</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {((sequence.openRate + sequence.replyRate) / 2).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(sequence.openRate + sequence.replyRate) / 2}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {sequence.status === "active" ? (
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </button>
                  )}
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Sequence Modal */}
      {showCreateModal && (
        <CreateSequenceModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateSequenceModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Email Sequence</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step === currentStep
                        ? "border-blue-600 bg-blue-600 text-white"
                        : step < currentStep
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        step < currentStep ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Details</span>
              <span>Steps</span>
              <span>Settings</span>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sequence Name *
                </label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enterprise Outbound Sequence"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the purpose of this sequence..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Segment
                </label>
                <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Leads</option>
                  <option>Enterprise</option>
                  <option>Mid-Market</option>
                  <option>SMB</option>
                  <option>Custom Segment</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Define the email steps in your sequence. Each step will be sent after a specified delay.
              </p>
              {[1, 2, 3].map((step) => (
                <div key={step} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Step {step}</h4>
                    <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Wait Time
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          className="block w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="2"
                        />
                        <select className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>Days</option>
                          <option>Hours</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Email subject..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Stop sequence when lead replies
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Stop sequence when lead books a meeting
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Send from team member (round-robin)
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sending Schedule
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      defaultValue="09:00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      defaultValue="17:00"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
              </button>
            ) : (
              <button className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create Sequence
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
