'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getUsers, saveUser, getAgency, saveAgency } from '@/lib/storage';
import { User, Agency } from '@/lib/types';
import { US_STATES } from '@/lib/constants';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    npn: '',
    ssnLast4: '',
    crdNumber: '',
    dateOfBirth: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [agencyData, setAgencyData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    fein: '',
    licenseNumber: '',
  });
  const [agencySaveStatus, setAgencySaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        npn: currentUser.npn || '',
        ssnLast4: currentUser.ssnLast4 || '',
        crdNumber: currentUser.crdNumber || '',
        dateOfBirth: currentUser.dateOfBirth || '',
      });

      if (isAdmin(currentUser)) {
        const agency = getAgency();
        if (agency) {
          setAgencyData({
            name: agency.name || '',
            address: agency.address || '',
            city: agency.city || '',
            state: agency.state || '',
            zipCode: agency.zipCode || '',
            phone: agency.phone || '',
            email: agency.email || '',
            fein: agency.fein || '',
            licenseNumber: agency.licenseNumber || '',
          });
        }
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaveStatus('saving');

    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      npn: formData.npn,
      ssnLast4: formData.ssnLast4,
      crdNumber: formData.crdNumber,
      dateOfBirth: formData.dateOfBirth,
    };

    saveUser(updatedUser);
    
    // Update current user in localStorage
    localStorage.setItem('licenseguard_current_user', JSON.stringify(updatedUser));
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAgencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAgencySaveStatus('saving');

    const agency = getAgency();
    if (agency) {
      const updatedAgency: Agency = {
        ...agency,
        name: agencyData.name,
        address: agencyData.address,
        city: agencyData.city,
        state: agencyData.state,
        zipCode: agencyData.zipCode,
        phone: agencyData.phone,
        email: agencyData.email,
        fein: agencyData.fein,
        licenseNumber: agencyData.licenseNumber,
      };
      saveAgency(updatedAgency);
    }

    setAgencySaveStatus('saved');
    setTimeout(() => setAgencySaveStatus('idle'), 2000);
  };

  const niprUrl = `https://hub.app.nipr.com/my-nipr/frontend/identify-licensee`;
  const sirconUrl = `https://www.sircon.com/ComplianceExpress/NonSscrbEducation/index.jsp?nonSscrb=Y&sscrbid=9999`;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and license credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Licensee Credentials</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        National Producer Number (NPN)
                      </label>
                      <input
                        type="text"
                        value={formData.npn}
                        onChange={(e) => setFormData({ ...formData, npn: e.target.value })}
                        placeholder="Enter your NPN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your NPN is used to access NIPR and state insurance portals
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last 4 Digits of SSN
                      </label>
                      <input
                        type="text"
                        value={formData.ssnLast4}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, ssnLast4: value.slice(0, 4) });
                        }}
                        placeholder="XXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Required for NIPR license verification and renewal
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CRD Number <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.crdNumber}
                        onChange={(e) => setFormData({ ...formData, crdNumber: e.target.value })}
                        placeholder="Enter your CRD Number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Central Registration Depository number for securities licenses
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Required for license verification and FINRA registrations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                      saveStatus === 'saved'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {saveStatus === 'saving' && '💾 Saving...'}
                    {saveStatus === 'saved' && '✓ Saved Successfully!'}
                    {saveStatus === 'idle' && 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {user && isAdmin(user) && (
              <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Agency Information</h2>

                <form onSubmit={handleAgencySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={agencyData.name}
                      onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
                      placeholder="Enter agency name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agency License Number
                      </label>
                      <input
                        type="text"
                        value={agencyData.licenseNumber}
                        onChange={(e) => setAgencyData({ ...agencyData, licenseNumber: e.target.value })}
                        placeholder="Enter agency license number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        FEIN <span className="text-gray-400 font-normal">(Federal Employer ID Number)</span>
                      </label>
                      <input
                        type="text"
                        value={agencyData.fein}
                        onChange={(e) => setAgencyData({ ...agencyData, fein: e.target.value })}
                        placeholder="XX-XXXXXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={agencyData.address}
                      onChange={(e) => setAgencyData({ ...agencyData, address: e.target.value })}
                      placeholder="123 Main Street, Suite 100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={agencyData.city}
                        onChange={(e) => setAgencyData({ ...agencyData, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        value={agencyData.state}
                        onChange={(e) => setAgencyData({ ...agencyData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {US_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={agencyData.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d-]/g, '');
                          setAgencyData({ ...agencyData, zipCode: value.slice(0, 10) });
                        }}
                        placeholder="12345"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={agencyData.phone}
                        onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agency Email
                      </label>
                      <input
                        type="email"
                        value={agencyData.email}
                        onChange={(e) => setAgencyData({ ...agencyData, email: e.target.value })}
                        placeholder="info@agency.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      type="submit"
                      disabled={agencySaveStatus === 'saving'}
                      className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                        agencySaveStatus === 'saved'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {agencySaveStatus === 'saving' && 'Saving...'}
                      {agencySaveStatus === 'saved' && 'Agency Info Saved!'}
                      {agencySaveStatus === 'idle' && 'Save Agency Information'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Quick Links Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* NIPR Quick Link */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🏛️</div>
                <h3 className="text-lg font-semibold text-gray-900">NIPR Portal</h3>
                <p className="text-sm text-gray-600 mt-1">
                  National Insurance Producer Registry
                </p>
              </div>
              
              <a
                href={niprUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Start License Renewal
              </a>
              
              {(formData.npn || formData.ssnLast4 || formData.crdNumber || formData.dateOfBirth) && (
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Quick Fill Info:</p>
                  {formData.npn && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">NPN:</span> {formData.npn}
                    </p>
                  )}
                  {formData.ssnLast4 && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">SSN Last 4:</span> {formData.ssnLast4}
                    </p>
                  )}
                  {formData.crdNumber && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">CRD:</span> {formData.crdNumber}
                    </p>
                  )}
                  {formData.dateOfBirth && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">DOB:</span> {new Date(formData.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sircon CE Tracking */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-lg font-semibold text-gray-900">CE Credits</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Check your continuing education status
                </p>
              </div>
              
              <a
                href={sirconUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                View CE Progress
              </a>
              
              <p className="text-xs text-gray-600 mt-4 text-center">
                Track completed vs required hours for each state license
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-xs text-gray-700">
                    Save your NPN and SSN last 4 here for quick access when renewing licenses through NIPR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
