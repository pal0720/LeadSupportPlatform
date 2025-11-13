"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building,
  Mail,
  LifeBuoy,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data for charts
const leadTrendData = [
  { name: "Jan", leads: 400, qualified: 240, converted: 180 },
  { name: "Feb", leads: 500, qualified: 300, converted: 220 },
  { name: "Mar", leads: 600, qualified: 380, converted: 280 },
  { name: "Apr", leads: 700, qualified: 450, converted: 340 },
  { name: "May", leads: 850, qualified: 520, converted: 410 },
  { name: "Jun", leads: 950, qualified: 610, converted: 480 },
];

const sequencePerformanceData = [
  { name: "Intro Sequence", sent: 1200, opened: 780, clicked: 340, replied: 125 },
  { name: "Follow-up", sent: 800, opened: 520, clicked: 210, replied: 89 },
  { name: "Nurture", sent: 650, opened: 390, clicked: 156, replied: 45 },
  { name: "Re-engagement", sent: 450, opened: 220, clicked: 88, replied: 32 },
];

const ticketVolumeData = [
  { name: "Mon", tickets: 45, resolved: 38 },
  { name: "Tue", tickets: 52, resolved: 48 },
  { name: "Wed", tickets: 61, resolved: 55 },
  { name: "Thu", tickets: 48, resolved: 44 },
  { name: "Fri", tickets: 39, resolved: 36 },
  { name: "Sat", tickets: 22, resolved: 20 },
  { name: "Sun", tickets: 18, resolved: 17 },
];

const accountHealthData = [
  { name: "Healthy", value: 245, color: "#10b981" },
  { name: "At Risk", value: 68, color: "#f59e0b" },
  { name: "Critical", value: 23, color: "#ef4444" },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLeads: 3254,
    leadsChange: 12.5,
    totalCompanies: 847,
    companiesChange: 8.2,
    activeSequences: 24,
    sequencesChange: 4.0,
    openTickets: 156,
    ticketsChange: -15.3,
    healthyAccounts: 245,
    accountsChange: 5.8,
    monthlyRevenue: 89400,
    revenueChange: 18.6,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening with your GTM platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          change={stats.leadsChange}
          icon={Target}
          loading={loading}
        />
        <StatCard
          title="Companies"
          value={stats.totalCompanies.toLocaleString()}
          change={stats.companiesChange}
          icon={Building}
          loading={loading}
        />
        <StatCard
          title="Active Sequences"
          value={stats.activeSequences}
          change={stats.sequencesChange}
          icon={Mail}
          loading={loading}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          change={stats.ticketsChange}
          icon={LifeBuoy}
          loading={loading}
        />
        <StatCard
          title="Healthy Accounts"
          value={stats.healthyAccounts}
          change={stats.accountsChange}
          icon={TrendingUp}
          loading={loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}k`}
          change={stats.revenueChange}
          icon={Zap}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lead Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leadTrendData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" name="Total Leads" />
              <Area type="monotone" dataKey="qualified" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorQualified)" name="Qualified" />
              <Area type="monotone" dataKey="converted" stroke="#10b981" fillOpacity={1} fill="#10b981" name="Converted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sequence Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sequence Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sequencePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
              <Bar dataKey="opened" fill="#8b5cf6" name="Opened" />
              <Bar dataKey="clicked" fill="#06b6d4" name="Clicked" />
              <Bar dataKey="replied" fill="#10b981" name="Replied" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Volume */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Support Ticket Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} name="New Tickets" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Account Health Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Health Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accountHealthData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {accountHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { action: "New lead created", detail: "john@acme.com from form submission", time: "2 minutes ago", type: "lead" },
            { action: "Sequence enrolled", detail: "Sarah Johnson added to 'Product Demo' sequence", time: "15 minutes ago", type: "sequence" },
            { action: "Ticket resolved", detail: "Support ticket #1234 resolved by Mike Chen", time: "1 hour ago", type: "support" },
            { action: "Account health alert", detail: "Acme Corp health score dropped to 65", time: "2 hours ago", type: "alert" },
            { action: "Email replied", detail: "Jane Smith replied to outreach email", time: "3 hours ago", type: "email" },
          ].map((activity, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "lead" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                    activity.type === "sequence" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
                    activity.type === "support" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                    activity.type === "alert" ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                  }`}>
                    {activity.type === "lead" && <Target className="h-5 w-5" />}
                    {activity.type === "sequence" && <Mail className="h-5 w-5" />}
                    {activity.type === "support" && <LifeBuoy className="h-5 w-5" />}
                    {activity.type === "alert" && <TrendingUp className="h-5 w-5" />}
                    {activity.type === "email" && <Mail className="h-5 w-5" />}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.detail}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  loading: boolean;
}) {
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <div className="flex items-center mt-2">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
      </div>
    </div>
  );
}
