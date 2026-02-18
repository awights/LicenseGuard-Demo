'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getLicenses, saveLicense, deleteLicense, getDaysUntilExpiry, formatDate, getUsers } from '@/lib/storage';
import { License, User } from '@/lib/types';
import { LICENSE_TYPES, US_STATES } from '@/lib/constants';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLicenses();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = licenses;

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === filterStatus);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.type.toLowerCase().includes(query) ||
        l.licenseNumber.toLowerCase().includes(query) ||
        l.state.toLowerCase().includes(query)
      );
    }

    setFilteredLicenses(filtered);
  }, [licenses, filterStatus, searchQuery]);

  const loadLicenses = () => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) return;

    const allLicenses = getLicenses();
    const userLicenses = user.role === 'admin'
      ? allLicenses
      : allLicenses.filter(l => l.userId === user.id);

    setLicenses(userLicenses);
  };

  const handleAddNew = () => {
    setEditingLicense(null);
    setShowModal(true);
  };

  const handleEdit = (license: License) => {
    setEditingLicense(license);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this license?')) {
      deleteLicense(id);
      loadLicenses();
    }
  };

  const handleSave = () => {
    setShowModal(false);
    loadLicenses();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Licenses & Certifications</h1>
              <p className="text-gray-600 mt-2">Manage all your insurance licenses</p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://hub.app.nipr.com/my-nipr/frontend/identify-licensee"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center"
              >
                <span className="mr-2">🏛️</span>
                Renew on NIPR
              </a>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
              >
                <span className="mr-2">➕</span>
                Add License
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by type, number, or state..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Licenses</option>
                <option value="active">Active</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Licenses List */}
        {filteredLicenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {licenses.length === 0 ? 'No licenses yet' : 'No licenses match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {licenses.length === 0 
                ? 'Start tracking your insurance licenses and certifications'
                : 'Try adjusting your search or filters'
              }
            </p>
            {licenses.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Your First License
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLicenses.map((license) => {
                  const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
                  return (
                    <tr key={license.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{license.type}</div>
                        {license.notes && (
                          <div className="text-xs text-gray-500">{license.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {license.licenseNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {license.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(license.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={license.status} daysUntilExpiry={daysUntilExpiry} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(license)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(license.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        {license.renewalLink && (
                          <a
                            href={license.renewalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            Renew
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <LicenseModal
          license={editingLicense}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

function LicenseModal({
  license,
  currentUser,
  onClose,
  onSave,
}: {
  license: License | null;
  currentUser: User | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<License>>(
    license || {
      userId: currentUser?.id || '',
      type: 'State Producer',
      licenseNumber: '',
      state: 'CA',
      issueDate: '',
      expiryDate: '',
      renewalLink: '',
      notes: '',
      documents: [],
      status: 'active',
    }
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const users = getUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const licenseData: License = {
      id: license?.id || `lic-${Date.now()}`,
      userId: formData.userId || currentUser?.id || '',
      type: formData.type as License['type'],
      licenseNumber: formData.licenseNumber || '',
      state: formData.state || '',
      issueDate: formData.issueDate || '',
      expiryDate: formData.expiryDate || '',
      renewalLink: formData.renewalLink,
      notes: formData.notes,
      status: 'active', // Will be calculated in saveLicense
      documents: formData.documents || [],
    };

    saveLicense(licenseData);
    onSave();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: selectedFile.name,
        uploadDate: new Date().toISOString(),
        size: selectedFile.size,
        type: selectedFile.type,
        data: reader.result as string,
      };

      setFormData({
        ...formData,
        documents: [...(formData.documents || []), newDoc],
      });
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {license ? 'Edit License' : 'Add New License'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin(currentUser) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as License['type'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                {LICENSE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewal Link (Optional)
              </label>
              <input
                type="url"
                value={formData.renewalLink || ''}
                onChange={(e) => setFormData({ ...formData, renewalLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <span className="text-4xl mb-2">📎</span>
                  <span className="text-sm text-gray-600">Click to upload document</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</span>
                </label>
                {selectedFile && (
                  <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded">
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Upload
                    </button>
                  </div>
                )}
              </div>
              {formData.documents && formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(1)} KB • {formatDate(doc.uploadDate)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            documents: formData.documents?.filter((d) => d.id !== doc.id),
                          });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {license ? 'Update License' : 'Add License'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
