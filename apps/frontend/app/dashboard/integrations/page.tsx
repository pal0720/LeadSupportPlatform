"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Check,
  Settings,
  Zap,
  Mail,
  Calendar,
  MessageSquare,
  Users,
  Database,
  Globe,
  ShoppingCart,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  X,
  Code,
  Webhook,
} from "lucide-react";

type IntegrationCategory = "crm" | "email" | "calendar" | "messaging" | "social" | "analytics" | "ecommerce" | "other";
type IntegrationStatus = "connected" | "disconnected" | "error";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  logo?: string;
  features: string[];
  lastSync?: string;
  recordsSynced?: number;
}

const integrations: Integration[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync contacts, leads, and opportunities with Salesforce CRM",
    category: "crm",
    status: "connected",
    features: ["Two-way sync", "Real-time updates", "Custom fields"],
    lastSync: "2 minutes ago",
    recordsSynced: 3254,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect with HubSpot CRM and Marketing Hub",
    category: "crm",
    status: "connected",
    features: ["Contact sync", "Deal tracking", "Email integration"],
    lastSync: "5 minutes ago",
    recordsSynced: 1847,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and track emails through Gmail",
    category: "email",
    status: "connected",
    features: ["Email sending", "Open tracking", "Link tracking"],
    lastSync: "1 minute ago",
    recordsSynced: 5672,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Integrate with Outlook for email and calendar",
    category: "email",
    status: "disconnected",
    features: ["Email sync", "Calendar sync", "Contact sync"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meetings and schedule events",
    category: "calendar",
    status: "connected",
    features: ["Meeting sync", "Event creation", "Availability checking"],
    lastSync: "10 minutes ago",
    recordsSynced: 234,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates in Slack",
    category: "messaging",
    status: "connected",
    features: ["Notifications", "Bot commands", "Channel updates"],
    lastSync: "Real-time",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Import contacts and track LinkedIn activities",
    category: "social",
    status: "disconnected",
    features: ["Contact import", "Activity tracking", "InMail integration"],
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps through Zapier",
    category: "other",
    status: "connected",
    features: ["Automated workflows", "Multi-app connections", "Custom triggers"],
    lastSync: "Real-time",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Track payments and customer subscriptions",
    category: "ecommerce",
    status: "disconnected",
    features: ["Payment tracking", "Subscription sync", "Customer data"],
  },
];

const categories = [
  { id: "all" as const, name: "All Integrations", icon: Globe },
  { id: "crm" as IntegrationCategory, name: "CRM", icon: Users },
  { id: "email" as IntegrationCategory, name: "Email", icon: Mail },
  { id: "calendar" as IntegrationCategory, name: "Calendar", icon: Calendar },
  { id: "messaging" as IntegrationCategory, name: "Messaging", icon: MessageSquare },
  { id: "social" as IntegrationCategory, name: "Social", icon: Users },
  { id: "analytics" as IntegrationCategory, name: "Analytics", icon: Database },
  { id: "ecommerce" as IntegrationCategory, name: "E-commerce", icon: ShoppingCart },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | "all">("all");
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case "connected":
        return {
          bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: <Check className="h-3 w-3 mr-1" />,
          label: "Connected",
        };
      case "error":
        return {
          bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: "Error",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: null,
          label: "Not Connected",
        };
    }
  };

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const totalRecords = integrations.reduce((sum, i) => sum + (i.recordsSynced || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect your favorite tools and automate your workflow
          </p>
        </div>
        <button
          onClick={() => setShowWebhookModal(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Webhook className="h-4 w-4 mr-2" />
          Webhooks
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected</p>
            <Zap className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{connectedCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of {integrations.length} available</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Records Synced</p>
            <Database className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRecords.toLocaleString()}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+234 today</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Sync</p>
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">2m</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ago</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Webhooks</p>
            <Webhook className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">endpoints</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Search integrations..."
          />
        </div>
      </div>

      {/* Connected Integrations */}
      {filteredIntegrations.filter(i => i.status === "connected").length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connected Integrations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations
              .filter(i => i.status === "connected")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      {filteredIntegrations.filter(i => i.status !== "connected").length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Integrations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations
              .filter(i => i.status !== "connected")
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </div>
      )}

      {/* Webhook Modal */}
      {showWebhookModal && (
        <WebhookModal onClose={() => setShowWebhookModal(false)} />
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const status = getStatusBadge(integration.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {/* Logo Placeholder */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {integration.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {integration.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${status.bg} mt-1`}>
                {status.icon}
                {status.label}
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {integration.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {integration.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Sync Info */}
        {integration.status === "connected" && integration.lastSync && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-green-700 dark:text-green-400">
                <RefreshCw className="h-3 w-3 mr-1" />
                Last sync: {integration.lastSync}
              </div>
              {integration.recordsSynced && (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  {integration.recordsSynced.toLocaleString()} records
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {integration.status === "connected" ? (
            <>
              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync Now
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Disconnect
              </button>
            </>
          ) : (
            <button className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              <LinkIcon className="h-4 w-4 mr-1" />
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status: IntegrationStatus) {
  switch (status) {
    case "connected":
      return {
        bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: <Check className="h-3 w-3 mr-1" />,
        label: "Connected",
      };
    case "error":
      return {
        bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        label: "Error",
      };
    default:
      return {
        bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        icon: null,
        label: "Not Connected",
      };
  }
}

function WebhookModal({ onClose }: { onClose: () => void }) {
  const webhooks = [
    {
      id: "1",
      name: "New Lead Created",
      url: "https://api.example.com/webhooks/lead-created",
      events: ["lead.created"],
      status: "active",
    },
    {
      id: "2",
      name: "Deal Won",
      url: "https://api.example.com/webhooks/deal-won",
      events: ["deal.won", "deal.updated"],
      status: "active",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Webhooks</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure webhooks to receive real-time notifications
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Add Webhook Button */}
          <button className="w-full mb-6 inline-flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Add New Webhook
          </button>

          {/* Webhooks List */}
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{webhook.name}</h4>
                    <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <Code className="h-3 w-3 mr-1" />
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{webhook.url}</code>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {webhook.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {webhook.events.map((event, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {event}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Test
                  </button>
                  <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-xs border border-red-300 dark:border-red-600 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Documentation Link */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <Code className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">API Documentation</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Learn how to configure webhooks and handle events in our API documentation.
                </p>
                <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  View Documentation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
