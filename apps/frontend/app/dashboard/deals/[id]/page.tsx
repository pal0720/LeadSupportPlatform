"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Percent,
  TrendingUp,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash,
  Sparkles,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export default function DealDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"timeline" | "activities" | "notes">("timeline");
  const [newNote, setNewNote] = useState("");

  // Mock deal data
  const deal = {
    id: params.id,
    title: "Enterprise Platform License",
    company: "Acme Corp",
    amount: 150000,
    probability: 75,
    expectedCloseDate: "2024-02-28",
    stage: "proposal",
    owner: "John Doe",
    createdAt: "2024-01-10",
    description: "Large enterprise deal for platform licensing including custom integrations and premium support.",
  };

  const company = {
    name: "Acme Corp",
    industry: "Technology",
    size: "500-1000 employees",
    website: "acme.com",
    address: "123 Tech Street, San Francisco, CA",
  };

  const contacts = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "VP of Engineering",
      email: "sarah@acme.com",
      phone: "+1 (555) 123-4567",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "CTO",
      email: "michael@acme.com",
      phone: "+1 (555) 123-4568",
      isPrimary: false,
    },
  ];

  const timeline = [
    {
      id: "1",
      type: "email",
      title: "Proposal sent",
      description: "Sent comprehensive proposal including pricing and implementation timeline",
      timestamp: "2024-01-25 10:30 AM",
      user: "John Doe",
    },
    {
      id: "2",
      type: "meeting",
      title: "Discovery call completed",
      description: "30-minute call to discuss requirements and pain points",
      timestamp: "2024-01-20 2:00 PM",
      user: "John Doe",
    },
    {
      id: "3",
      type: "note",
      title: "Initial contact made",
      description: "Connected via LinkedIn, expressed strong interest in platform",
      timestamp: "2024-01-15 9:15 AM",
      user: "John Doe",
    },
    {
      id: "4",
      type: "status",
      title: "Deal created",
      description: "Deal moved to Qualification stage",
      timestamp: "2024-01-10 11:00 AM",
      user: "System",
    },
  ];

  const activities = [
    {
      id: "1",
      type: "upcoming",
      title: "Product demo presentation",
      date: "2024-02-10",
      time: "2:00 PM",
      attendees: ["Sarah Johnson", "Michael Chen"],
    },
    {
      id: "2",
      type: "upcoming",
      title: "Follow-up call",
      date: "2024-02-05",
      time: "10:00 AM",
      attendees: ["Sarah Johnson"],
    },
    {
      id: "3",
      type: "completed",
      title: "Sent pricing proposal",
      date: "2024-01-25",
      time: "10:30 AM",
      completedBy: "John Doe",
    },
  ];

  const notes = [
    {
      id: "1",
      content: "Customer is very interested in the enterprise features, particularly the custom integrations. They mentioned budget approval is expected by end of Q1.",
      author: "John Doe",
      timestamp: "2024-01-25 3:45 PM",
    },
    {
      id: "2",
      content: "Technical requirements: Need support for SSO, custom API integrations, and dedicated infrastructure. Security compliance is critical.",
      author: "Jane Smith",
      timestamp: "2024-01-20 4:30 PM",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "meeting":
        return <Calendar className="h-5 w-5" />;
      case "note":
        return <FileText className="h-5 w-5" />;
      case "status":
        return <Activity className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "meeting":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "note":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "status":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/deals"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Deals
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{deal.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {deal.company}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {deal.owner}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(deal.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Deal Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(deal.amount / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Percent className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Probability</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{deal.probability}%</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Weighted Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${((deal.amount * deal.probability) / 100000).toFixed(0)}k
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected Close</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatDate(deal.expectedCloseDate)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{deal.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Deal is progressing well - 25% faster than average deals in this stage</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Recommended: Schedule technical demo within next 7 days to maintain momentum</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Similar deals have 82% win rate when proposal is sent within 2 weeks of discovery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: "timeline" as const, name: "Timeline", icon: Activity },
                  { id: "activities" as const, name: "Activities", icon: Calendar },
                  { id: "notes" as const, name: "Notes", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(item.type)}`}>
                          {getActivityIcon(item.type)}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">by {item.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === "activities" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Activities</h4>
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {activities.filter(a => a.type === "upcoming").map((activity) => (
                        <div key={activity.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h5>
                              <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(activity.date)} at {activity.time}
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-gray-400">
                                <User className="h-3 w-3 mr-1" />
                                {activity.attendees.join(", ")}
                              </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 cursor-pointer hover:text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Completed Activities</h4>
                    <div className="space-y-3">
                      {activities.filter(a => a.type === "completed").map((activity) => (
                        <div key={activity.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(activity.date)} by {activity.completedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-6">
                  {/* Add Note Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add New Note
                    </label>
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add your note here..."
                    />
                    <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </button>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <User className="h-3 w-3 mr-1" />
                            {note.author}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{note.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Company Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <p className="text-gray-900 dark:text-white font-medium">{company.name}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Industry:</span>
                <p className="text-gray-900 dark:text-white">{company.industry}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <p className="text-gray-900 dark:text-white">{company.size}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Website:</span>
                <a href={`https://${company.website}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {company.website}
                </a>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contacts
              </h3>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                <Plus className="h-4 w-4 inline mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.title}</p>
                    </div>
                    {contact.isPrimary && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-2" />
                      {contact.email}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-3 w-3 mr-2" />
                      {contact.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
