"use client";

import { useState } from "react";
import {
  Plus,
  Building,
  Users,
  Crown,
  Star,
  Settings,
  ChevronRight,
  X,
  Check,
  Search,
  MoreVertical,
  UserPlus,
  Sparkles,
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  memberCount: number;
  role: "owner" | "admin" | "member";
  createdAt: string;
  logo?: string;
}

const initialWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Acme Corporation",
    slug: "acme-corp",
    plan: "enterprise",
    memberCount: 24,
    role: "owner",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Startup Inc",
    slug: "startup-inc",
    plan: "professional",
    memberCount: 8,
    role: "admin",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Personal Workspace",
    slug: "personal",
    plan: "free",
    memberCount: 1,
    role: "owner",
    createdAt: "2024-03-01",
  },
];

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return {
          bg: "bg-gradient-to-r from-purple-600 to-pink-600",
          text: "text-white",
          icon: <Crown className="h-3 w-3" />,
          label: "Enterprise",
        };
      case "professional":
        return {
          bg: "bg-gradient-to-r from-blue-600 to-cyan-600",
          text: "text-white",
          icon: <Star className="h-3 w-3" />,
          label: "Professional",
        };
      case "starter":
        return {
          bg: "bg-gradient-to-r from-green-600 to-emerald-600",
          text: "text-white",
          icon: <Sparkles className="h-3 w-3" />,
          label: "Starter",
        };
      default:
        return {
          bg: "bg-gray-200 dark:bg-gray-700",
          text: "text-gray-700 dark:text-gray-300",
          icon: null,
          label: "Free",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workspaces</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and switch between your workspaces
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workspaces</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{workspaces.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {workspaces.reduce((sum, w) => sum + w.memberCount, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Owner Role</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {workspaces.filter((w) => w.role === "owner").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium Plans</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {workspaces.filter((w) => w.plan !== "free").length}
          </p>
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
            placeholder="Search workspaces..."
          />
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkspaces.map((workspace) => {
          const badge = getPlanBadge(workspace.plan);
          return (
            <div
              key={workspace.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header with gradient */}
              <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {/* Plan badge */}
                <div className="absolute top-3 right-3">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                    {badge.icon && <span className="mr-1">{badge.icon}</span>}
                    {badge.label}
                  </div>
                </div>
              </div>

              <div className="p-6 -mt-8">
                {/* Logo/Avatar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800">
                    {workspace.logo ? (
                      <img src={workspace.logo} alt={workspace.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Workspace Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {workspace.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{workspace.slug}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {workspace.memberCount} {workspace.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {workspace.role}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Switch workspace logic
                      window.location.href = `/dashboard?workspace=${workspace.id}`;
                    }}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Switch
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWorkspace(workspace);
                      setShowMembersModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `/dashboard/settings?workspace=${workspace.id}`;
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspaceModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Members Modal */}
      {showMembersModal && selectedWorkspace && (
        <MembersModal
          workspace={selectedWorkspace}
          onClose={() => {
            setShowMembersModal(false);
            setSelectedWorkspace(null);
          }}
        />
      )}
    </div>
  );
}

function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setWorkspaceName(name);
    if (!workspaceSlug || workspaceSlug === generateSlug(workspaceName)) {
      setWorkspaceSlug(generateSlug(name));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Workspace
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s <= step
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      s < step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Basic Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workspace Slug *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    app.gtm.com/
                  </span>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="acme-corp"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Choose Your Plan</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { name: "Free", price: "$0", features: ["1 workspace", "Up to 3 members", "Basic features"] },
                  { name: "Starter", price: "$29", features: ["3 workspaces", "Up to 10 members", "Advanced features"] },
                  { name: "Professional", price: "$99", features: ["Unlimited workspaces", "Up to 50 members", "All features"] },
                  { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "Custom integrations", "Priority support"] },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <h5 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h5>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {plan.price}
                      {plan.price !== "Custom" && <span className="text-sm text-gray-500">/mo</span>}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Invite Team Members (Optional)</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Addresses
                </label>
                <textarea
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="john@example.com&#10;jane@example.com&#10;..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter one email per line. They'll receive an invitation to join your workspace.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => step < 3 ? setStep(step + 1) : onClose()}
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {step === 3 ? "Create Workspace" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MembersModal({ workspace, onClose }: { workspace: Workspace; onClose: () => void }) {
  const members = [
    { id: "1", name: "John Doe", email: "john@acme.com", role: "owner", avatar: "JD" },
    { id: "2", name: "Jane Smith", email: "jane@acme.com", role: "admin", avatar: "JS" },
    { id: "3", name: "Mike Johnson", email: "mike@acme.com", role: "member", avatar: "MJ" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {workspace.name} Members
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {workspace.memberCount} total members
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <button className="w-full mb-4 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </button>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
