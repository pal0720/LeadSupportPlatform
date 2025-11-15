"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  DollarSign,
  Calendar,
  TrendingUp,
  Building,
  User,
  X,
  Percent,
  ChevronDown,
} from "lucide-react";

interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  probability: number;
  expectedCloseDate: string;
  stage: string;
  owner: string;
  createdAt: string;
}

const stages = [
  { id: "prospecting", name: "Prospecting", color: "from-gray-500 to-gray-600" },
  { id: "qualification", name: "Qualification", color: "from-blue-500 to-blue-600" },
  { id: "proposal", name: "Proposal", color: "from-purple-500 to-purple-600" },
  { id: "negotiation", name: "Negotiation", color: "from-yellow-500 to-yellow-600" },
  { id: "closed-won", name: "Closed Won", color: "from-green-500 to-green-600" },
  { id: "closed-lost", name: "Closed Lost", color: "from-red-500 to-red-600" },
];

const initialDeals: Deal[] = [
  {
    id: "1",
    title: "Enterprise Platform License",
    company: "Acme Corp",
    amount: 150000,
    probability: 75,
    expectedCloseDate: "2024-02-28",
    stage: "proposal",
    owner: "John Doe",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Annual Subscription Renewal",
    company: "TechStart Inc",
    amount: 45000,
    probability: 90,
    expectedCloseDate: "2024-02-15",
    stage: "negotiation",
    owner: "Jane Smith",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    title: "Professional Services Package",
    company: "DataFlow LLC",
    amount: 75000,
    probability: 60,
    expectedCloseDate: "2024-03-15",
    stage: "qualification",
    owner: "Mike Johnson",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Starter Plan Upgrade",
    company: "CloudVentures",
    amount: 25000,
    probability: 85,
    expectedCloseDate: "2024-02-20",
    stage: "proposal",
    owner: "Sarah Wilson",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    title: "Custom Integration Project",
    company: "FinTech Solutions",
    amount: 120000,
    probability: 40,
    expectedCloseDate: "2024-04-01",
    stage: "prospecting",
    owner: "John Doe",
    createdAt: "2024-01-25",
  },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState("default");
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDealsByStage = (stageId: string) => {
    return filteredDeals.filter((deal) => deal.stage === stageId);
  };

  const getTotalValue = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedDeal) {
      setDeals(deals.map(deal =>
        deal.id === draggedDeal.id ? { ...deal, stage: stageId } : deal
      ));
      setDraggedDeal(null);
    }
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your sales pipeline and close more deals
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pipeline Value</p>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${(totalPipelineValue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% vs last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weighted Value</p>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${(weightedValue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8.3% vs last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deals</p>
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{deals.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3 new this week</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Deal Size</p>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${(totalPipelineValue / deals.length / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Per deal</p>
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
                placeholder="Search deals..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="default">Default Pipeline</option>
              <option value="enterprise">Enterprise Sales</option>
              <option value="smb">SMB Sales</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex space-x-4 min-w-full">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageValue = getTotalValue(stage.id);

            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div className={`bg-gradient-to-r ${stage.color} rounded-t-lg p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stage.name}</h3>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-sm text-white text-opacity-90">
                    ${(stageValue / 1000).toFixed(0)}k total
                  </p>
                </div>

                {/* Deals Column */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-b-lg p-3 min-h-[600px] space-y-3">
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDragStart={() => handleDragStart(deal)}
                    />
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <CreateDealModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function DealCard({ deal, onDragStart }: { deal: Deal; onDragStart: () => void }) {
  return (
    <Link href={`/dashboard/deals/${deal.id}`}>
      <div
        draggable
        onDragStart={onDragStart}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-all cursor-move border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 group"
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {deal.title}
          </h4>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Building className="h-4 w-4 mr-2" />
            {deal.company}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              {(deal.amount / 1000).toFixed(0)}k
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Percent className="h-3 w-3 mr-1" />
              {deal.probability}%
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
          </div>

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <User className="h-3 w-3 mr-1" />
            {deal.owner}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CreateDealModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Deal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deal Title *
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enterprise Platform License"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deal Value *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="150000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Probability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Close Date
              </label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stage *
              </label>
              <select
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deal Owner
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Mike Johnson</option>
                <option>Sarah Wilson</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Add deal details..."
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
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
