'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getCurrentUser } from '@/lib/auth';
import { CECredit } from '@/lib/types';

export default function CECreditsPage() {
  const [credits, setCredits] = useState<CECredit[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState<CECredit | null>(null);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = () => {
    const user = getCurrentUser();
    if (!user) return;

    // Load from localStorage
    const stored = localStorage.getItem('licenseguard_ce_credits');
    const allCredits: CECredit[] = stored ? JSON.parse(stored) : [];
    
    const userCredits = user.role === 'admin'
      ? allCredits
      : allCredits.filter(c => c.userId === user.id);
    
    setCredits(userCredits);
  };

  const handleSave = (credit: CECredit) => {
    const stored = localStorage.getItem('licenseguard_ce_credits');
    const allCredits: CECredit[] = stored ? JSON.parse(stored) : [];
    
    const index = allCredits.findIndex(c => c.id === credit.id);
    if (index >= 0) {
      allCredits[index] = credit;
    } else {
      allCredits.push(credit);
    }
    
    localStorage.setItem('licenseguard_ce_credits', JSON.stringify(allCredits));
    loadCredits();
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this CE credit record?')) {
      const stored = localStorage.getItem('licenseguard_ce_credits');
      const allCredits: CECredit[] = stored ? JSON.parse(stored) : [];
      const filtered = allCredits.filter(c => c.id !== id);
      localStorage.setItem('licenseguard_ce_credits', JSON.stringify(filtered));
      loadCredits();
    }
  };

  const sirconUrl = 'https://www.sircon.com/ComplianceExpress/NonSscrbEducation/index.jsp?nonSscrb=Y&sscrbid=9999';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Continuing Education (CE) Credits</h1>
              <p className="text-gray-600 mt-2">Track your CE requirements and completion status</p>
            </div>
            <div className="flex gap-3">
              <a
                href={sirconUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center"
              >
                <span className="mr-2">📚</span>
                Check Sircon
              </a>
              <button
                onClick={() => {
                  setEditingCredit(null);
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
              >
                <span className="mr-2">➕</span>
                Add CE Record
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">About Sircon CE Tracking</h3>
              <p className="text-sm text-gray-700 mb-2">
                Sircon is the industry standard for tracking continuing education credits. Use the "Check Sircon" button above to:
              </p>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>View your CE credits by state</li>
                <li>See required vs completed hours</li>
                <li>Check compliance status for license renewals</li>
                <li>Access official CE transcripts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CE Credits List */}
        {credits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CE Records Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your continuing education requirements and completed courses
            </p>
            <button
              onClick={() => {
                setEditingCredit(null);
                setShowModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Your First CE Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credits.map((credit) => (
              <CECreditCard
                key={credit.id}
                credit={credit}
                onEdit={() => {
                  setEditingCredit(credit);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(credit.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <CECreditModal
          credit={editingCredit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

function CECreditCard({
  credit,
  onEdit,
  onDelete,
}: {
  credit: CECredit;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const percentComplete = (credit.hoursCompleted / credit.hoursRequired) * 100;
  const isComplete = percentComplete >= 100;
  const expiryDate = new Date(credit.expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${
      isComplete ? 'border-green-300' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{credit.state}</h3>
          <p className="text-sm text-gray-600">CE Requirements</p>
        </div>
        {isComplete && <span className="text-2xl">✓</span>}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-900 font-semibold">
            {credit.hoursCompleted} / {credit.hoursRequired} hours
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentComplete, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round(percentComplete)}% complete
        </p>
      </div>

      {/* Details */}
      {credit.courseName && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">Latest Course</p>
          <p className="text-sm text-gray-900">{credit.courseName}</p>
        </div>
      )}

      {credit.provider && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">Provider</p>
          <p className="text-sm text-gray-900">{credit.provider}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500">Expiry Date</p>
        <p className="text-sm text-gray-900">
          {new Date(credit.expiryDate).toLocaleDateString()}
        </p>
        {daysUntilExpiry < 90 && daysUntilExpiry >= 0 && (
          <p className="text-xs text-yellow-600 font-medium mt-1">
            ⚠️ Expires in {daysUntilExpiry} days
          </p>
        )}
        {daysUntilExpiry < 0 && (
          <p className="text-xs text-red-600 font-medium mt-1">
            ⚠️ Expired
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-medium text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function CECreditModal({
  credit,
  onClose,
  onSave,
}: {
  credit: CECredit | null;
  onClose: () => void;
  onSave: (credit: CECredit) => void;
}) {
  const user = getCurrentUser();
  const [formData, setFormData] = useState<Partial<CECredit>>(
    credit || {
      userId: user?.id || '',
      state: '',
      hoursRequired: 24,
      hoursCompleted: 0,
      courseName: '',
      completionDate: '',
      provider: '',
      expiryDate: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ceCredit: CECredit = {
      id: credit?.id || `ce-${Date.now()}`,
      userId: formData.userId || user?.id || '',
      state: formData.state || '',
      hoursRequired: formData.hoursRequired || 24,
      hoursCompleted: formData.hoursCompleted || 0,
      courseName: formData.courseName,
      completionDate: formData.completionDate,
      provider: formData.provider,
      expiryDate: formData.expiryDate || '',
    };

    onSave(ceCredit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {credit ? 'Edit CE Record' : 'Add CE Record'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g., CA, NY, TX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Required
                </label>
                <input
                  type="number"
                  value={formData.hoursRequired}
                  onChange={(e) => setFormData({ ...formData, hoursRequired: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Completed
                </label>
                <input
                  type="number"
                  value={formData.hoursCompleted}
                  onChange={(e) => setFormData({ ...formData, hoursCompleted: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name (Optional)
              </label>
              <input
                type="text"
                value={formData.courseName || ''}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="e.g., Ethics in Insurance Sales"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider (Optional)
              </label>
              <input
                type="text"
                value={formData.provider || ''}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., WebCE, Kaplan"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Date (Optional)
              </label>
              <input
                type="date"
                value={formData.completionDate || ''}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {credit ? 'Update Record' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
