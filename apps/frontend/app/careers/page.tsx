"use client";

import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Users, Zap, Globe } from "lucide-react";

const openPositions = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build the future of AI-powered GTM platforms. Work with React, Node.js, Python, and cutting-edge AI technologies.",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "Remote (Global)",
    type: "Full-time",
    description: "Develop and train AI agents that transform how businesses engage with customers. Experience with LLMs required.",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Create beautiful, intuitive experiences for complex AI-powered workflows. Strong portfolio required.",
  },
  {
    id: 4,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Help our customers succeed with AI agents. Experience in B2B SaaS required.",
  },
  {
    id: 5,
    title: "Developer Advocate",
    department: "Developer Relations",
    location: "Remote (Global)",
    type: "Full-time",
    description: "Build community, create content, and help developers succeed with our platform.",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: Globe,
    title: "Work From Anywhere",
    description: "Fully remote-first company. Work from anywhere in the world.",
  },
  {
    icon: Zap,
    title: "Unlimited PTO",
    description: "Take the time you need to recharge and perform at your best.",
  },
  {
    icon: Users,
    title: "Learning & Development",
    description: "$5,000/year learning budget for courses, conferences, and books.",
  },
];

const values = [
  {
    title: "Customer Obsession",
    description: "We're maniacally focused on delivering value to our customers.",
  },
  {
    title: "Move Fast",
    description: "We ship quickly, learn from feedback, and iterate.",
  },
  {
    title: "Own It",
    description: "We take ownership of our work and outcomes.",
  },
  {
    title: "Be Kind",
    description: "We treat everyone with respect and empathy.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Join Our Mission</h1>
            <p className="text-xl text-blue-100 mb-8">
              We're building the future of AI-powered customer lifecycle management.
              Join a team of world-class engineers, designers, and innovators.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-blue-100 text-sm">Team Members</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold">$50M</div>
                <div className="text-blue-100 text-sm">Series B Raised</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold">1000+</div>
                <div className="text-blue-100 text-sm">Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We invest in our team's success and well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find your next opportunity with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {position.title}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {position.department}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {position.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Don't see a role that fits? We're always looking for talented people.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Send us your resume
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center text-white">
          <Briefcase className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to make an impact?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our team and help build the future of AI-powered customer engagement.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
}
