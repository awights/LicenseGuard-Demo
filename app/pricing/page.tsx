'use client';

import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/constants';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stop Losing Licenses. Start Staying Compliant.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            The #1 license management platform for insurance agencies. 
            Trusted by 500+ agencies to protect their agents' licenses and stay audit-ready.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-3 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Individual Plan */}
          <PricingCard
            name={PRICING_PLANS.individual.name}
            price={
              billingCycle === 'monthly'
                ? `$${PRICING_PLANS.individual.price}`
                : `$${PRICING_PLANS.individual.annualPrice}`
            }
            period={billingCycle === 'monthly' ? '/month' : '/month (billed annually)'}
            description="For solo agents and small independent practices"
            features={PRICING_PLANS.individual.features}
            highlighted={false}
            savings={billingCycle === 'annual' ? PRICING_PLANS.individual.savingsText : undefined}
            ctaText="Start Free Trial"
            ctaLink="/login"
          />

          {/* Agency Plan */}
          <PricingCard
            name={PRICING_PLANS.agency.name}
            price={
              billingCycle === 'monthly'
                ? `$${PRICING_PLANS.agency.price}`
                : `$${PRICING_PLANS.agency.annualPrice}`
            }
            period={billingCycle === 'monthly' ? '/month' : '/month (billed annually)'}
            description="Perfect for growing agencies with 10-50 agents"
            features={PRICING_PLANS.agency.features}
            highlighted={true}
            badge="Most Popular"
            savings={billingCycle === 'annual' ? PRICING_PLANS.agency.savingsText : undefined}
            ctaText="Start Free Trial"
            ctaLink="/login"
            valueNote="Just $19.90/agent included • Add more agents for only $19/month each"
          />

          {/* Enterprise Plan */}
          <PricingCard
            name={PRICING_PLANS.enterprise.name}
            price="Custom"
            period=""
            description="For large agencies & brokerages with 50+ agents"
            features={PRICING_PLANS.enterprise.features}
            highlighted={false}
            isEnterprise={true}
            ctaText="Schedule Demo"
            ctaLink="/login"
            valueNote="Volume discounts • Custom contract terms • Dedicated support"
          />
        </div>

        {/* Social Proof Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-16 text-white text-center">
          <p className="text-2xl font-bold mb-4">
            "LicenseGuard saved us from a $50K E&O claim by catching an expired license before renewal."
          </p>
          <p className="text-blue-100">
            — Sarah Mitchell, Managing Partner at Mitchell Insurance Group (42 agents)
          </p>
        </div>

        {/* ROI Calculator Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            The Cost of Non-Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600 mb-2">$25K+</div>
              <div className="text-gray-700 font-semibold">Average E&O Claim</div>
              <div className="text-sm text-gray-600 mt-2">for unlicensed agent violations</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600 mb-2">$10K+</div>
              <div className="text-gray-700 font-semibold">State Fines</div>
              <div className="text-sm text-gray-600 mt-2">per expired license violation</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600 mb-2">40+ hrs</div>
              <div className="text-gray-700 font-semibold">Manual Tracking</div>
              <div className="text-sm text-gray-600 mt-2">wasted per month by admins</div>
            </div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-500">
            <div className="text-4xl font-bold text-green-600 mb-2">$199/mo</div>
            <div className="text-gray-700 font-semibold mb-2">Protect Your Entire Agency</div>
            <div className="text-sm text-gray-600">
              One missed license can cost 100x more than a year of LicenseGuard
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Compare Plans
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
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold bg-blue-50">
                    Agency
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
                  feature="Agents Included"
                  individual="1 agent"
                  team="10 agents"
                  enterprise="50+ agents"
                />
                <FeatureRow
                  feature="Additional Agents"
                  individual="—"
                  team="$19/month each"
                  enterprise="Volume pricing"
                />
                <FeatureRow
                  feature="Renewal Alerts"
                  individual="90/60/30 days"
                  team="Custom schedules"
                  enterprise="Custom + SMS"
                />
                <FeatureRow
                  feature="Document Storage"
                  individual="500 MB"
                  team="10 GB"
                  enterprise="Unlimited"
                />
                <FeatureRow
                  feature="Mobile App"
                  individual={true}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Calendar & Dashboard"
                  individual={true}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="CE Credit Tracking"
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
                  feature="Team Management"
                  individual={false}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Audit Reports"
                  individual={false}
                  team={true}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Manager Approvals"
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
                  feature="SSO / SAML"
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
                  feature="Dedicated Manager"
                  individual={false}
                  team={false}
                  enterprise={true}
                />
                <FeatureRow
                  feature="Support"
                  individual="Email (24hr)"
                  team="Priority (4hr)"
                  enterprise="Phone + 1hr SLA"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FAQItem
              question="How does the 14-day free trial work?"
              answer="Sign up instantly with no credit card required. Get full access to all features of your chosen plan. No obligations—if you don't love it, just walk away. No charges, no questions asked."
            />
            <FAQItem
              question="Can I change plans later?"
              answer="Absolutely! Upgrade or downgrade anytime. If you upgrade mid-cycle, we'll prorate the difference. Downgrades take effect at your next billing cycle. No penalties, no hassle."
            />
            <FAQItem
              question="What if I have more than 10 agents?"
              answer="On the Agency plan, add unlimited additional agents for just $19/month per agent. Need 50+ agents? Contact us for Enterprise volume discounts and custom pricing."
            />
            <FAQItem
              question="Do you integrate with my current systems?"
              answer="Yes! Agency and Enterprise plans include integrations with popular AMS systems (Applied Epic, Vertafore AMS360, HawkSoft) and CRMs. Custom integrations available on Enterprise."
            />
            <FAQItem
              question="What happens if I miss a renewal?"
              answer="Our multi-channel alerts (email, SMS on Enterprise) make it nearly impossible to miss. But if you do, your data is always accessible, and we'll help you get back on track."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Bank-level security with 256-bit encryption, SOC 2 Type II compliance, and daily backups. Enterprise plans include SSO and advanced security features. Your license data is safer with us than in spreadsheets."
            />
            <FAQItem
              question="Can I export my data?"
              answer="Yes! Export all your license data, documents, and reports anytime in CSV or PDF format. We believe in data portability—you're never locked in."
            />
            <FAQItem
              question="What if I need help getting started?"
              answer="Agency plans include a free onboarding session. Enterprise gets white-glove onboarding over 30-60 days. Plus, our support team is always ready to help via email, priority support, or phone."
            />
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Leading Insurance Agencies
            </h3>
            <p className="text-gray-600">Join 500+ agencies managing 15,000+ licenses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Agencies Trust Us</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">15K+</div>
              <div className="text-sm text-gray-600">Licenses Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Renewal Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">$2M+</div>
              <div className="text-sm text-gray-600">Saved in Fines</div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Protect Your Agency?
          </h2>
          <p className="text-xl mb-2 text-blue-100">
            Start your 14-day free trial—no credit card required
          </p>
          <p className="text-lg mb-8 text-blue-200">
            Join 500+ agencies who sleep better knowing their licenses are protected
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="inline-block px-10 py-5 bg-white text-blue-600 text-lg font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/login"
              className="inline-block px-10 py-5 bg-blue-700 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition-colors border-2 border-white"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            ✓ Setup in under 5 minutes  ✓ No credit card required  ✓ Cancel anytime
          </p>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-12 text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-4xl mb-2">🛡️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-600">
            Not satisfied? Get a full refund within 30 days—no questions asked. We're confident you'll love LicenseGuard.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Have questions? Call us at <span className="font-semibold text-blue-600">(410) 546-8445</span> or email <span className="font-semibold text-blue-600">Alex@heightsfg.com</span>
            </p>
            <p className="text-sm text-gray-500">
              © 2024 LicenseGuard by Heights Financial Group LLC. Built for insurance professionals.
            </p>
          </div>
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
  savings,
  ctaText,
  ctaLink,
  valueNote,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  isEnterprise?: boolean;
  savings?: string;
  ctaText: string;
  ctaLink: string;
  valueNote?: string;
}) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
        highlighted ? 'ring-4 ring-blue-500 scale-105 transform' : ''
      }`}
    >
      {badge && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold px-6 py-2 rounded-bl-2xl shadow-lg">
          {badge}
        </div>
      )}
      <div className={`p-8 ${highlighted ? 'bg-gradient-to-br from-blue-50 to-white' : ''}`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-6 min-h-[3rem]">{description}</p>
        <div className="mb-6">
          <div>
            <span className="text-5xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-gray-600 text-lg ml-1">{period}</span>}
          </div>
          {savings && (
            <div className="mt-2 inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
              💰 {savings}
            </div>
          )}
          {valueNote && (
            <p className="text-sm text-gray-600 mt-3 italic">{valueNote}</p>
          )}
        </div>
        <Link
          href={ctaLink}
          className={`block w-full text-center py-4 px-6 rounded-xl font-bold transition-all text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
            highlighted
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {ctaText} →
        </Link>
        {!isEnterprise && (
          <p className="text-center text-sm text-gray-600 mt-3">
            14-day free trial • No credit card required
          </p>
        )}
      </div>
      <div className="px-8 pb-8">
        <div className="border-t border-gray-200 pt-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 font-bold mr-3 mt-1 text-lg">✓</span>
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
        <span className="text-green-600 text-2xl font-bold">✓</span>
      ) : (
        <span className="text-gray-300 text-xl">—</span>
      );
    }
    return <span className="text-gray-900 font-medium">{value}</span>;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-4 px-6 text-gray-900 font-medium">{feature}</td>
      <td className="py-4 px-6 text-center">{renderCell(individual)}</td>
      <td className="py-4 px-6 text-center bg-blue-50">{renderCell(team)}</td>
      <td className="py-4 px-6 text-center">{renderCell(enterprise)}</td>
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}
