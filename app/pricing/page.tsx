'use client';

import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/constants';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            🛡️ LicenseGuard
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Sign In →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your insurance agency. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Individual Plan */}
          <PricingCard
            name={PRICING_PLANS.individual.name}
            price={`$${PRICING_PLANS.individual.price}`}
            period="/month"
            description="Perfect for individual insurance agents"
            features={PRICING_PLANS.individual.features}
            highlighted={false}
          />

          {/* Team Plan */}
          <PricingCard
            name={PRICING_PLANS.team.name}
            price={`$${PRICING_PLANS.team.price}`}
            period="/month"
            description="Ideal for growing insurance agencies"
            features={PRICING_PLANS.team.features}
            highlighted={true}
            badge="Most Popular"
          />

          {/* Enterprise Plan */}
          <PricingCard
            name={PRICING_PLANS.enterprise.name}
            price="Custom"
            period=""
            description="For large agencies with custom needs"
            features={PRICING_PLANS.enterprise.features}
            highlighted={false}
            isEnterprise={true}
          />
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">
                    Individual
                  </th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">
                    Team
                  </th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <FeatureRow
                  feature="License Tracking"
                  individual="Unlimited"
                  team="Unlimited"
                  enterprise="Unlimited"
                />
                <FeatureRow
                  feature="Team Members"
                  individual="1"
                  team="5 (+$15/seat)"
                  enterprise="10+"
                />
                <FeatureRow
                  feature="Renewal Alerts"
                  individual={true}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Document Storage"
                  individual="100 MB"
                  team="1 GB"
                  enterprise="Unlimited"
                />
                <FeatureRow
                  feature="Calendar View"
                  individual={true}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Mobile App"
                  individual={true}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Bulk Upload"
                  individual={false}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Admin Dashboard"
                  individual={false}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Custom Integrations"
                  individual={false}
                  team={false}
                  enterprise={true}
                />
                <FeatureRow
                  feature="SSO Authentication"
                  individual={false}
                  team={false}
                  enterprise={true}
                />
                <FeatureRow
                  feature="API Access"
                  individual={false}
                  team={false}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Dedicated Support"
                  individual="Email"
                  team="Priority Email"
                  enterprise="Phone + Email"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FAQItem
              question="Can I change plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express) and ACH bank transfers for annual plans."
            />
            <FAQItem
              question="Is there a setup fee?"
              answer="No setup fees, ever. You only pay the monthly or annual subscription fee based on your chosen plan."
            />
            <FAQItem
              question="What happens to my data if I cancel?"
              answer="You can export all your data before canceling. We'll keep your data for 30 days after cancellation in case you change your mind."
            />
            <FAQItem
              question="Do you offer annual billing?"
              answer="Yes! Pay annually and save 20% on all plans. Contact us for annual pricing details."
            />
            <FAQItem
              question="Can I get a demo first?"
              answer="Absolutely! Sign up for a free 14-day trial with full access to all features. No credit card required."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of insurance professionals who trust LicenseGuard
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Your Free Trial
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 LicenseGuard. Built for insurance professionals, by insurance professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  badge,
  isEnterprise,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  isEnterprise?: boolean;
}) {
  return (
    <div
      className={`relative bg-white rounded-lg shadow-xl overflow-hidden ${
        highlighted ? 'ring-4 ring-blue-500 scale-105' : ''
      }`}
    >
      {badge && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          {badge}
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600 text-lg">{period}</span>}
        </div>
        <Link
          href="/login"
          className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${
            highlighted
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {isEnterprise ? 'Contact Sales' : 'Start Free Trial'}
        </Link>
      </div>
      <div className="px-8 pb-8">
        <div className="border-t border-gray-200 pt-8">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  feature,
  individual,
  team,
  enterprise,
}: {
  feature: string;
  individual: boolean | string;
  team: boolean | string;
  enterprise: boolean | string;
}) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-green-600 text-xl">✓</span>
      ) : (
        <span className="text-gray-300 text-xl">—</span>
      );
    }
    return <span className="text-gray-900">{value}</span>;
  };

  return (
    <tr>
      <td className="py-4 px-6 text-gray-900">{feature}</td>
      <td className="py-4 px-6 text-center">{renderCell(individual)}</td>
      <td className="py-4 px-6 text-center">{renderCell(team)}</td>
      <td className="py-4 px-6 text-center">{renderCell(enterprise)}</td>
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
