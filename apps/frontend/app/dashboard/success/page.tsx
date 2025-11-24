"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Activity,
  MessageSquare,
  Calendar,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";

interface Account {
  id: string;
  company: string;
  healthScore: number;
  trend: "up" | "down" | "stable";
  mrr: number;
  contractEnd: string;
  lastContact: string;
  csm: string;
  status: "healthy" | "at-risk" | "critical" | "churned";
  engagement: number;
  supportTickets: number;
  nps: number;
}

const initialAccounts: Account[] = [
  {
    id: "1",
    company: "Acme Corporation",
    healthScore: 85,
    trend: "up",
    mrr: 5000,
    contractEnd: "2024-12-31",
    lastContact: "2024-01-18",
    csm: "Sarah Wilson",
    status: "healthy",
    engagement: 92,
    supportTickets: 2,
    nps: 9,
  },
  {
    id: "2",
    company: "TechStart Inc",
    healthScore: 45,
    trend: "down",
    mrr: 3000,
    contractEnd: "2024-03-15",
    lastContact: "2024-01-05",
    csm: "Mike Johnson",
    status: "at-risk",
    engagement: 35,
    supportTickets: 8,
    nps: 5,
  },
  {
    id: "3",
    company: "DataFlow LLC",
    healthScore: 72,
    trend: "stable",
    mrr: 7500,
    contractEnd: "2024-08-20",
    lastContact: "2024-01-19",
    csm: "Lisa Chen",
    status: "healthy",
    engagement: 78,
    supportTickets: 3,
    nps: 8,
  },
  {
    id: "4",
    company: "Cloud Ventures",
    healthScore: 25,
    trend: "down",
    mrr: 2000,
    contractEnd: "2024-02-28",
    lastContact: "2023-12-20",
    csm: "Tom Anderson",
    status: "critical",
    engagement: 15,
    supportTickets: 12,
    nps: 3,
  },
  {
    id: "5",
    company: "FinTech Solutions",
    healthScore: 95,
    trend: "up",
    mrr: 12000,
    contractEnd: "2024-11-30",
    lastContact: "2024-01-20",
    csm: "Sarah Wilson",
    status: "healthy",
    engagement: 98,
    supportTickets: 1,
    nps: 10,
  },
];

export default function SuccessPage() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.csm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 70) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "at-risk":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "churned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const totalMRR = accounts.reduce((sum, a) => sum + a.mrr, 0);
  const avgHealthScore = accounts.length > 0
    ? accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Success</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor account health and customer satisfaction
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total MRR</p>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${(totalMRR / 1000).toFixed(1)}k
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Health Score</p>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${getHealthColor(avgHealthScore)}`}>
            {avgHealthScore.toFixed(0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">out of 100</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk</p>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {accounts.filter((a) => a.status === "at-risk" || a.status === "critical").length}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Requires attention</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Healthy Accounts</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {accounts.filter((a) => a.status === "healthy").length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {((accounts.filter((a) => a.status === "healthy").length / accounts.length) * 100).toFixed(0)}% of total
          </p>
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
                placeholder="Search accounts..."
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
              <option value="healthy">Healthy</option>
              <option value="at-risk">At Risk</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Health Score
                </label>
                <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700">
                  <option>All Scores</option>
                  <option>90-100 (Excellent)</option>
                  <option>70-89 (Good)</option>
                  <option>50-69 (Fair)</option>
                  <option>0-49 (Poor)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CSM
                </label>
                <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700">
                  <option>All CSMs</option>
                  <option>Sarah Wilson</option>
                  <option>Mike Johnson</option>
                  <option>Lisa Chen</option>
                  <option>Tom Anderson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Renewal
                </label>
                <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700">
                  <option>All Timeframes</option>
                  <option>Next 30 Days</option>
                  <option>Next 60 Days</option>
                  <option>Next 90 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accounts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {account.company}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      CSM: {account.csm}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${account.mrr}/mo
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Renewal: {formatDate(account.contractEnd)}
                    </div>
                  </div>
                </div>

                {/* Health Score Badge */}
                <div className={`flex flex-col items-center px-4 py-2 rounded-lg ${getHealthBgColor(account.healthScore)}`}>
                  <div className="flex items-center">
                    <span className={`text-2xl font-bold ${getHealthColor(account.healthScore)}`}>
                      {account.healthScore}
                    </span>
                    {getTrendIcon(account.trend)}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Health Score</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Engagement</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {account.engagement}%
                    </span>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${account.engagement}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Support Tickets</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {account.supportTickets}
                    </span>
                    <MessageSquare className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">NPS Score</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {account.nps}/10
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {account.nps >= 9 ? "Promoter" : account.nps >= 7 ? "Passive" : "Detractor"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Last Contact</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(account.lastContact)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(account.lastContact) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                      ? "Overdue"
                      : "Recent"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {account.status === "at-risk" || account.status === "critical" ? (
                    <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Action Required
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      On Track
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
