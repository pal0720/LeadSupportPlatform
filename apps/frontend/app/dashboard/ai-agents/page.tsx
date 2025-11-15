"use client";

import { useState } from "react";
import {
  Bot,
  Plus,
  Search,
  Play,
  Pause,
  MessageSquare,
  TrendingUp,
  Mail,
  Phone,
  FileText,
  BarChart3,
  Users,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Settings,
  Sparkles,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type AgentType = "lead_qualifier" | "email_writer" | "call_analyzer" | "content_generator" | "data_enricher" | "deal_predictor" | "chatbot";
type AgentStatus = "idle" | "busy" | "error" | "paused";

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  tasksCompleted: number;
  tasksInQueue: number;
  lastActive: string;
  accuracy?: number;
  description: string;
}

const agentTypes = [
  {
    type: "lead_qualifier" as AgentType,
    name: "Lead Qualifier",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    description: "Automatically scores and qualifies leads based on behavior and demographics",
  },
  {
    type: "email_writer" as AgentType,
    name: "Email Writer",
    icon: Mail,
    color: "from-purple-500 to-purple-600",
    description: "Generates personalized email content for campaigns and sequences",
  },
  {
    type: "call_analyzer" as AgentType,
    name: "Call Analyzer",
    icon: Phone,
    color: "from-green-500 to-green-600",
    description: "Analyzes sales calls and provides actionable insights",
  },
  {
    type: "content_generator" as AgentType,
    name: "Content Generator",
    icon: FileText,
    color: "from-yellow-500 to-yellow-600",
    description: "Creates marketing content, blog posts, and social media updates",
  },
  {
    type: "data_enricher" as AgentType,
    name: "Data Enricher",
    icon: TrendingUp,
    color: "from-cyan-500 to-cyan-600",
    description: "Enriches contact and company data from multiple sources",
  },
  {
    type: "deal_predictor" as AgentType,
    name: "Deal Predictor",
    icon: BarChart3,
    color: "from-pink-500 to-pink-600",
    description: "Predicts deal outcomes and provides win probability scores",
  },
  {
    type: "chatbot" as AgentType,
    name: "Sales Chatbot",
    icon: MessageSquare,
    color: "from-indigo-500 to-indigo-600",
    description: "Engages with website visitors and qualifies them in real-time",
  },
];

const initialAgents: Agent[] = [
  {
    id: "1",
    name: "Lead Qualifier Pro",
    type: "lead_qualifier",
    status: "busy",
    tasksCompleted: 1247,
    tasksInQueue: 23,
    lastActive: "2 minutes ago",
    accuracy: 94,
    description: "Automatically scores and qualifies leads based on behavior and demographics",
  },
  {
    id: "2",
    name: "Email Campaign Writer",
    type: "email_writer",
    status: "idle",
    tasksCompleted: 856,
    tasksInQueue: 5,
    lastActive: "15 minutes ago",
    accuracy: 89,
    description: "Generates personalized email content for campaigns and sequences",
  },
  {
    id: "3",
    name: "Deal Intelligence",
    type: "deal_predictor",
    status: "busy",
    tasksCompleted: 432,
    tasksInQueue: 12,
    lastActive: "1 minute ago",
    accuracy: 91,
    description: "Predicts deal outcomes and provides win probability scores",
  },
];

const performanceData = [
  { date: "Mon", tasks: 145, accuracy: 92 },
  { date: "Tue", tasks: 168, accuracy: 94 },
  { date: "Wed", tasks: 152, accuracy: 91 },
  { date: "Thu", tasks: 189, accuracy: 95 },
  { date: "Fri", tasks: 201, accuracy: 93 },
  { date: "Sat", tasks: 98, accuracy: 90 },
  { date: "Sun", tasks: 76, accuracy: 89 },
];

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "busy":
        return {
          bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Zap className="h-3 w-3 mr-1 animate-pulse" />,
          label: "Busy",
        };
      case "idle":
        return {
          bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: "Idle",
        };
      case "error":
        return {
          bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: "Error",
        };
      case "paused":
        return {
          bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <Pause className="h-3 w-3 mr-1" />,
          label: "Paused",
        };
    }
  };

  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const activeTasks = agents.reduce((sum, agent) => sum + agent.tasksInQueue, 0);
  const avgAccuracy = agents.reduce((sum, agent) => sum + (agent.accuracy || 0), 0) / agents.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your AI-powered automation agents
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agents</p>
            <Bot className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {agents.filter(a => a.status === "busy").length} running
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks.toLocaleString()}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+234 today</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks in Queue</p>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeTasks}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Currently processing</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Accuracy</p>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgAccuracy.toFixed(0)}%</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2% vs last week</p>
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
            placeholder="Search agents..."
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => {
          const agentType = agentTypes.find(t => t.type === agent.type);
          const status = getStatusBadge(agent.status);
          const Icon = agentType?.icon || Bot;

          return (
            <div
              key={agent.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header with gradient */}
              <div className={`h-24 bg-gradient-to-r ${agentType?.color || "from-gray-500 to-gray-600"} relative`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute top-3 right-3">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>
              </div>

              <div className="p-6 -mt-8">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Agent Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{agent.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">In Queue</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.tasksInQueue}</p>
                  </div>
                </div>

                {/* Accuracy & Last Active */}
                {agent.accuracy && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Accuracy</span>
                      <span className="font-semibold">{agent.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${agent.accuracy}%` }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Last active: {agent.lastActive}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </button>
                  <button
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      agent.status === "busy"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                    }`}
                  >
                    {agent.status === "busy" ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="tasks" fill="#3b82f6" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Accuracy Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[85, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <CreateAgentModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Agent Chat Modal */}
      {selectedAgent && (
        <AgentChatModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

function CreateAgentModal({ onClose }: { onClose: () => void }) {
  const [selectedType, setSelectedType] = useState<AgentType | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New AI Agent</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Select Agent Type</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {agentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedType === type.type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{type.name}</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{type.description}</p>
                </button>
              );
            })}
          </div>

          {selectedType && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="My Custom Agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Configuration
                </label>
                <textarea
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add any specific instructions or configuration for this agent..."
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              disabled={!selectedType}
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentChatModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "agent",
      content: `Hello! I'm ${agent.name}. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date(),
      },
      {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "I'm processing your request. This is a demo response.",
        timestamp: new Date(),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              Chat with {agent.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{agent.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.type === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
