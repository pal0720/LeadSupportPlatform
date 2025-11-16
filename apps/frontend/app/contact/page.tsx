"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  Globe,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100">
              Have questions? We'd love to hear from you. Our team is here to help
              you succeed with our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 dark:text-green-200">
                      Message sent successfully! We'll get back to you soon.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <ContactMethod
                icon={<Mail className="h-6 w-6" />}
                title="Email Us"
                description="Our team typically responds within 24 hours"
                contact="hello@gtmplatform.com"
                color="blue"
              />
              <ContactMethod
                icon={<MessageSquare className="h-6 w-6" />}
                title="Live Chat"
                description="Available Mon-Fri, 9am-6pm PST"
                contact="Click the chat icon below"
                color="green"
              />
              <ContactMethod
                icon={<Phone className="h-6 w-6" />}
                title="Call Us"
                description="Enterprise customers only"
                contact="+1 (555) 123-4567"
                color="purple"
              />

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Response Times</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Email:</strong> Within 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Chat:</strong> Within 5 minutes (during business hours)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Phone:</strong> Immediate (enterprise customers)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Offices
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                We have teams around the world to support you wherever you are
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <OfficeCard
                city="San Francisco"
                country="USA"
                address="123 Market Street, Suite 400"
                zipcode="San Francisco, CA 94103"
                type="Headquarters"
              />
              <OfficeCard
                city="London"
                country="UK"
                address="456 Oxford Street"
                zipcode="London, W1D 1BS"
                type="European Office"
              />
              <OfficeCard
                city="Singapore"
                country="Singapore"
                address="789 Marina Bay"
                zipcode="Singapore 018956"
                type="Asia-Pacific Office"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              <FAQItem
                question="How quickly can I get started?"
                answer="You can sign up and start using the platform in less than 5 minutes. No credit card required for the 14-day free trial. Our onboarding wizard will guide you through the initial setup."
              />
              <FAQItem
                question="Do you offer implementation support?"
                answer="Yes! All paid plans include implementation support. Professional and Enterprise customers get dedicated onboarding specialists who will help you migrate data, set up integrations, and train your team."
              />
              <FAQItem
                question="What integrations do you support?"
                answer="We integrate with 100+ tools including Salesforce, HubSpot, Slack, Gmail, Outlook, Zapier, and more. Enterprise customers can also request custom integrations."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Absolutely. We're SOC 2 compliant, GDPR ready, and use enterprise-grade encryption. Your data is stored in secure data centers with regular backups. We'll never sell or share your data."
              />
              <FAQItem
                question="Can I cancel anytime?"
                answer="Yes, you can cancel your subscription at any time. No long-term contracts required (except for custom Enterprise agreements). If you cancel, you'll retain access until the end of your billing period."
              />
              <FAQItem
                question="Do you offer custom pricing for large teams?"
                answer="Yes! If you have 100+ users or unique requirements, contact our sales team for custom enterprise pricing. We offer volume discounts and flexible payment terms."
              />
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Still have questions?
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <HelpCircle className="h-5 w-5" />
                Visit our Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Follow us on social media for updates, tips, and industry insights
            </p>

            <div className="flex justify-center gap-6">
              <SocialLink
                icon={<Twitter className="h-6 w-6" />}
                label="Twitter"
                href="https://twitter.com"
                color="blue"
              />
              <SocialLink
                icon={<Linkedin className="h-6 w-6" />}
                label="LinkedIn"
                href="https://linkedin.com"
                color="indigo"
              />
              <SocialLink
                icon={<Github className="h-6 w-6" />}
                label="GitHub"
                href="https://github.com"
                color="gray"
              />
              <SocialLink
                icon={<Globe className="h-6 w-6" />}
                label="Blog"
                href="/blog"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="h-96 bg-gray-200 dark:bg-gray-700">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Interactive map would be embedded here
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              San Francisco Headquarters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactMethod({
  icon,
  title,
  description,
  contact,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  contact: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    purple: "from-purple-600 to-purple-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{description}</p>
      <p className="text-blue-600 dark:text-blue-400 font-semibold">{contact}</p>
    </div>
  );
}

function OfficeCard({
  city,
  country,
  address,
  zipcode,
  type,
}: {
  city: string;
  country: string;
  address: string;
  zipcode: string;
  type: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6 text-blue-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{city}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">{type}</div>
        </div>
      </div>
      <div className="text-gray-600 dark:text-gray-300 space-y-1">
        <p>{address}</p>
        <p>{zipcode}</p>
        <p className="font-semibold">{country}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{question}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  icon,
  label,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400",
    indigo: "from-indigo-600 to-indigo-400",
    gray: "from-gray-600 to-gray-400",
    purple: "from-purple-600 to-purple-400",
  };

  return (
    <Link
      href={href}
      className="group"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{label}</div>
    </Link>
  );
}
