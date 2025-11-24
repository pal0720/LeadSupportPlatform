"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Mail,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  UserPlus,
  Building,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [metric, setMetric] = useState("revenue");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your business performance and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              12.5%
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">$124,500</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">+$13,500 from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              8.3%
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1,248</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">+96 new this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              2.1%
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Email Open Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">68.4%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Industry avg: 65%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              15.2%
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">24.8%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">+3.2% from last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly recurring revenue</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {[
              { month: "Jan", value: 85, amount: "$85k" },
              { month: "Feb", value: 92, amount: "$92k" },
              { month: "Mar", value: 78, amount: "$78k" },
              { month: "Apr", value: 95, amount: "$95k" },
              { month: "May", value: 105, amount: "$105k" },
              { month: "Jun", value: 125, amount: "$125k" },
            ].map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.month}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(item.value / 125) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Sources</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Where your leads come from</p>
            </div>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {[
              { source: "Website", count: 450, percentage: 36, color: "bg-blue-600" },
              { source: "Referral", count: 320, percentage: 26, color: "bg-purple-600" },
              { source: "LinkedIn", count: 275, percentage: 22, color: "bg-green-600" },
              { source: "Events", count: 150, percentage: 12, color: "bg-yellow-600" },
              { source: "Other", count: 55, percentage: 4, color: "bg-gray-600" },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Funnel & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Sales Funnel
          </h3>
          <div className="space-y-3">
            {[
              { stage: "Visitors", count: 12450, percentage: 100, color: "from-blue-500 to-blue-600" },
              { stage: "Leads", count: 3240, percentage: 26, color: "from-purple-500 to-purple-600" },
              { stage: "Qualified", count: 1620, percentage: 13, color: "from-pink-500 to-pink-600" },
              { stage: "Proposals", count: 648, percentage: 5.2, color: "from-orange-500 to-orange-600" },
              { stage: "Customers", count: 162, percentage: 1.3, color: "from-green-500 to-green-600" },
            ].map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.stage}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({stage.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 flex items-center overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${stage.color} h-full rounded-full flex items-center justify-end px-3 transition-all`}
                    style={{ width: `${stage.percentage}%`, minWidth: stage.percentage < 20 ? '20%' : 'auto' }}
                  >
                    {stage.percentage >= 10 && (
                      <span className="text-xs font-semibold text-white">
                        {stage.percentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            User Engagement
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Page Views", value: "45.2k", icon: Eye, change: "+12%", positive: true },
              { label: "Click Rate", value: "8.4%", icon: MousePointerClick, change: "+2.3%", positive: true },
              { label: "New Signups", value: "1,248", icon: UserPlus, change: "+18%", positive: true },
              { label: "Active Users", value: "8,942", icon: Users, change: "-3%", positive: false },
              { label: "Avg Session", value: "4m 32s", icon: Calendar, change: "+8%", positive: true },
              { label: "Bounce Rate", value: "32%", icon: TrendingDown, change: "-5%", positive: true },
            ].map((metric) => (
              <div key={metric.label} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-5 w-5 text-gray-400" />
                  <span
                    className={`text-xs font-medium ${
                      metric.positive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Campaigns
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Click Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { name: "Product Launch Q1", sent: 4500, open: 86, click: 24, conversions: 145, revenue: "$72,500" },
                { name: "Enterprise Outbound", sent: 1200, open: 74, click: 18, conversions: 89, revenue: "$445,000" },
                { name: "Re-engagement Series", sent: 3200, open: 67, click: 15, conversions: 56, revenue: "$28,000" },
                { name: "Webinar Follow-up", sent: 890, open: 92, click: 31, conversions: 72, revenue: "$36,000" },
                { name: "Newsletter Monthly", sent: 8500, open: 58, click: 12, conversions: 124, revenue: "$62,000" },
              ].map((campaign) => (
                <tr key={campaign.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {campaign.sent.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {campaign.open}%
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${campaign.open}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {campaign.click}%
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${campaign.click}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {campaign.conversions}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {campaign.revenue}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
