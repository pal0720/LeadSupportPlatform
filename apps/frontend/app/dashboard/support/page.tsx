"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Eye,
  Edit,
  X,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils/date";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  customer: string;
  customerEmail: string;
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  responseTime?: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-1001",
    subject: "Login issues with SSO integration",
    description: "Users are unable to authenticate via SSO",
    customer: "John Doe",
    customerEmail: "john@acme.com",
    status: "open",
    priority: "urgent",
    category: "Technical",
    assignee: "Sarah Wilson",
    createdAt: "2024-01-20T10:30:00",
    updatedAt: "2024-01-20T10:30:00",
  },
  {
    id: "TKT-1002",
    subject: "Feature request: Export to CSV",
    description: "Request to add CSV export functionality",
    customer: "Emily Brown",
    customerEmail: "emily@techstart.io",
    status: "in-progress",
    priority: "medium",
    category: "Feature Request",
    assignee: "Mike Johnson",
    createdAt: "2024-01-19T14:20:00",
    updatedAt: "2024-01-20T09:15:00",
    responseTime: "2h 30m",
  },
  {
    id: "TKT-1003",
    subject: "Billing question about annual plan",
    description: "Customer inquiring about upgrade options",
    customer: "David Lee",
    customerEmail: "david@dataflow.com",
    status: "waiting",
    priority: "low",
    category: "Billing",
    assignee: "Lisa Chen",
    createdAt: "2024-01-19T11:00:00",
    updatedAt: "2024-01-19T16:45:00",
    responseTime: "45m",
  },
  {
    id: "TKT-1004",
    subject: "Dashboard not loading reports",
    description: "Reports section shows loading spinner indefinitely",
    customer: "Sarah Miller",
    customerEmail: "sarah@cloudventures.com",
    status: "resolved",
    priority: "high",
    category: "Bug",
    assignee: "Tom Anderson",
    createdAt: "2024-01-18T09:30:00",
    updatedAt: "2024-01-19T14:20:00",
    responseTime: "1h 15m",
  },
  {
    id: "TKT-1005",
    subject: "How to set up webhooks?",
    description: "Need guidance on webhook configuration",
    customer: "James Taylor",
    customerEmail: "james@fintech.io",
    status: "closed",
    priority: "medium",
    category: "Documentation",
    assignee: "Sarah Wilson",
    createdAt: "2024-01-17T13:00:00",
    updatedAt: "2024-01-18T10:30:00",
    responseTime: "30m",
  },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
      case "closed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer support requests and issues
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Open Tickets",
            value: tickets.filter((t) => t.status === "open").length,
            icon: AlertCircle,
            color: "text-red-600",
          },
          {
            label: "In Progress",
            value: tickets.filter((t) => t.status === "in-progress").length,
            icon: Clock,
            color: "text-blue-600",
          },
          {
            label: "Resolved Today",
            value: tickets.filter((t) => t.status === "resolved").length,
            icon: CheckCircle2,
            color: "text-green-600",
          },
          {
            label: "Avg Response",
            value: "1.5h",
            icon: MessageSquare,
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                  placeholder="Search tickets..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="waiting">Waiting</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700">
                    <option>All Categories</option>
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>Feature Request</option>
                    <option>Bug</option>
                    <option>Documentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignee
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700">
                    <option>All Team Members</option>
                    <option>Sarah Wilson</option>
                    <option>Mike Johnson</option>
                    <option>Lisa Chen</option>
                    <option>Tom Anderson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <input
                    type="date"
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tickets List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {ticket.id}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {ticket.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {ticket.customer}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {ticket.category}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatRelativeTime(ticket.createdAt)}
                    </div>
                    {ticket.responseTime && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Response: {ticket.responseTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-right mr-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.assignee}
                    </p>
                  </div>
                  <button className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{filteredTickets.length}</span> of{" "}
              <span className="font-medium">{tickets.length}</span> tickets
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateTicketModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Ticket</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority *
              </label>
              <select
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>Technical</option>
                <option>Billing</option>
                <option>Feature Request</option>
                <option>Bug</option>
                <option>Documentation</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign To
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Sarah Wilson</option>
                <option>Mike Johnson</option>
                <option>Lisa Chen</option>
                <option>Tom Anderson</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Detailed description of the issue..."
              />
            </div>
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
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
