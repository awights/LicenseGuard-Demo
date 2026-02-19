'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getLicenses, saveLicense, deleteLicense, getDaysUntilExpiry, formatDate, getUsers, getAgency } from '@/lib/storage';
import { License, User } from '@/lib/types';
import { LICENSE_TYPES, US_STATES } from '@/lib/constants';

export default function LicensesPage() {
  const searchParams = useSearchParams();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = () => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) return;

    const users = getUsers();
    setAllUsers(users);

    const allLicenses = getLicenses();
    const userLicenses = user.role === 'admin'
      ? allLicenses
      : allLicenses.filter(l => l.userId === user.id);

    setLicenses(userLicenses);
  };

  const filteredLicenses = useMemo(() => {
    let filtered = licenses;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === filterStatus);
    }

    if (filterAgent !== 'all') {
      filtered = filtered.filter(l => l.userId === filterAgent);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(l => l.type === filterType);
    }

    if (filterState !== 'all') {
      filtered = filtered.filter(l => l.state === filterState);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.type.toLowerCase().includes(query) ||
        l.licenseNumber.toLowerCase().includes(query) ||
        l.state.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [licenses, filterStatus, filterAgent, filterType, filterState, searchQuery]);

  const groupedByAgent = useMemo(() => {
    if (!isAdmin(currentUser)) return null;

    const userMap = new Map<string, User>();
    allUsers.forEach(u => userMap.set(u.id, u));

    const groups: { user: User; licenses: License[] }[] = [];
    const licensesByUser = new Map<string, License[]>();

    filteredLicenses.forEach(l => {
      const existing = licensesByUser.get(l.userId) || [];
      existing.push(l);
      licensesByUser.set(l.userId, existing);
    });

    licensesByUser.forEach((lics, userId) => {
      if (userId.startsWith('agency-')) {
        const ag = getAgency();
        const agencyAsUser: User = {
          id: userId,
          name: ag?.name ? `${ag.name} (Agency)` : 'Agency',
          email: ag?.email || '',
          role: 'admin',
          agencyId: ag?.id || '',
        };
        groups.push({ user: agencyAsUser, licenses: lics });
      } else {
        const user = userMap.get(userId);
        if (user) {
          groups.push({ user, licenses: lics });
        }
      }
    });

    groups.sort((a, b) => a.user.name.localeCompare(b.user.name));

    return groups;
  }, [filteredLicenses, allUsers, currentUser]);

  const agency = useMemo(() => getAgency(), []);

  const activeStates = useMemo(() => {
    const states = new Set<string>();
    licenses.forEach(l => states.add(l.state));
    return Array.from(states).sort();
  }, [licenses]);

  const activeTypes = useMemo(() => {
    const types = new Set<string>();
    licenses.forEach(l => types.add(l.type));
    return Array.from(types).sort();
  }, [licenses]);

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

  const getUserName = (userId: string) => {
    if (userId.startsWith('agency-')) {
      const ag = getAgency();
      return ag?.name ? `${ag.name} (Agency)` : 'Agency';
    }
    const user = allUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const renderLicenseRow = (license: License) => {
    const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
    const producer = allUsers.find(u => u.id === license.userId);
    return (
      <tr key={license.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {license.type === 'Certification' && license.certificationName
              ? `Certification: ${license.certificationName}`
              : license.type}
            {license.isResidentState && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Resident
              </span>
            )}
          </div>
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
          {producer?.ssnLast4 ? `***-**-${producer.ssnLast4}` : <span className="text-gray-400">--</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {producer?.dateOfBirth ? formatDate(producer.dateOfBirth) : <span className="text-gray-400">--</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(license.expiryDate)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={license.status} daysUntilExpiry={daysUntilExpiry} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {license.documents && license.documents.length > 0 ? (
            <button
              onClick={() => {
                const doc = license.documents[license.documents.length - 1];
                const win = window.open('', '_blank');
                if (win) {
                  if (doc.type.startsWith('image/')) {
                    win.document.write(`<html><head><title>${doc.name}</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6"><img src="${doc.data}" style="max-width:100%;max-height:100vh" /></body></html>`);
                  } else {
                    win.document.write(`<html><head><title>${doc.name}</title></head><body style="margin:0"><iframe src="${doc.data}" style="width:100%;height:100vh;border:none"></iframe></body></html>`);
                  }
                  win.document.close();
                }
              }}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <span className="mr-1">📄</span>
              View
            </button>
          ) : (
            <span className="text-gray-400">--</span>
          )}
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
          <a
            href={license.renewalLink || 'https://hub.app.nipr.com/my-nipr/frontend/identify-licensee'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-900"
          >
            Renew
          </a>
        </td>
      </tr>
    );
  };

  const tableHeader = (
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
          SSN Last 4
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Date of Birth
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Expiry Date
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Document
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  const adminView = isAdmin(currentUser);
  const hasActiveFilters = filterStatus !== 'all' || filterAgent !== 'all' || filterType !== 'all' || filterState !== 'all' || searchQuery !== '';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Licenses & Certifications</h1>
              <p className="text-gray-600 mt-2">
                {adminView
                  ? `Manage all licenses${agency ? ` for ${agency.name}` : ''}`
                  : 'Manage all your insurance licenses'}
              </p>
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
              <a
                href="/team"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
              >
                <span className="mr-2">👤</span>
                Add Agent
              </a>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium flex items-center"
              >
                <span className="mr-2">📥</span>
                Import CSV
              </button>
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

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className={`grid grid-cols-1 gap-4 ${adminView ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
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
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            {adminView && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Agent
                  </label>
                  <select
                    value={filterAgent}
                    onChange={(e) => setFilterAgent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Agents</option>
                    {(() => {
                      const ag = getAgency();
                      return ag ? (
                        <option value={`agency-${ag.id}`}>
                          {ag.name || 'Agency'} (Agency)
                        </option>
                      ) : null;
                    })()}
                    {allUsers
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by License Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    {activeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by State
                  </label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All States</option>
                    {activeStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredLicenses.length} of {licenses.length} licenses
              </p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterAgent('all');
                  setFilterType('all');
                  setFilterState('all');
                  setSearchQuery('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

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
        ) : adminView && groupedByAgent && filterAgent === 'all' ? (
          <div className="space-y-6">
            {groupedByAgent.map(({ user, licenses: agentLicenses }) => {
              const activeLics = agentLicenses.filter(l => l.status === 'active').length;
              const expiringLics = agentLicenses.filter(l => l.status === 'expiring-soon').length;
              const expiredLics = agentLicenses.filter(l => l.status === 'expired').length;
              const isAgencyRow = user.id.startsWith('agency-');
              return (
                <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className={`${isAgencyRow ? 'bg-blue-50' : 'bg-gray-50'} px-6 py-4 border-b border-gray-200`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${isAgencyRow ? 'bg-blue-200' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                          <span className="text-blue-700 font-semibold text-sm">
                            {isAgencyRow ? '🏢' : user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{isAgencyRow ? 'Agency Licenses' : user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">{agentLicenses.length} license{agentLicenses.length !== 1 ? 's' : ''}</span>
                        {activeLics > 0 && <span className="text-green-600 font-medium">{activeLics} active</span>}
                        {expiringLics > 0 && <span className="text-yellow-600 font-medium">{expiringLics} expiring</span>}
                        {expiredLics > 0 && <span className="text-red-600 font-medium">{expiredLics} expired</span>}
                      </div>
                    </div>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    {tableHeader}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agentLicenses.map(renderLicenseRow)}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              {tableHeader}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLicenses.map(renderLicenseRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <LicenseModal
          license={editingLicense}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showImportModal && (
        <CSVImportModal
          currentUser={currentUser}
          allUsers={allUsers}
          onClose={() => setShowImportModal(false)}
          onImport={() => {
            setShowImportModal(false);
            loadLicenses();
          }}
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
      type: 'Life & Health',
      licenseNumber: '',
      state: 'CA',
      issueDate: '',
      expiryDate: '',
      renewalLink: 'https://hub.app.nipr.com/my-nipr/frontend/identify-licensee',
      notes: '',
      documents: [],
      status: 'active',
      isResidentState: false,
      certificationName: '',
    }
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [issueDateError, setIssueDateError] = useState('');
  const users = getUsers();

  const maxIssueDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  const handleIssueDateChange = (value: string) => {
    const selected = new Date(value);
    const limit = new Date();
    limit.setDate(limit.getDate() + 7);
    limit.setHours(23, 59, 59, 999);

    if (selected > limit) {
      setIssueDateError('Issue date cannot be more than 7 days in the future');
    } else {
      setIssueDateError('');
    }
    setFormData({ ...formData, issueDate: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (issueDateError) return;

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
      status: 'active',
      documents: formData.documents || [],
      isResidentState: formData.isResidentState || false,
      certificationName: formData.type === 'Certification' ? formData.certificationName : undefined,
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
                  {(() => {
                    const ag = getAgency();
                    return ag ? (
                      <option value={`agency-${ag.id}`}>
                        {ag.name || 'Agency'} (Agency)
                      </option>
                    ) : null;
                  })()}
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

            {formData.type === 'Certification' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Name
                </label>
                <input
                  type="text"
                  value={formData.certificationName || ''}
                  onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                  placeholder="e.g., Certified Insurance Counselor (CIC)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Resident State License</span>
                <p className="text-xs text-gray-500 mt-0.5">Only one license can be marked as your resident state</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isResidentState: !formData.isResidentState })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isResidentState ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isResidentState ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
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
                  onChange={(e) => handleIssueDateChange(e.target.value)}
                  max={maxIssueDate}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${issueDateError ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {issueDateError && (
                  <p className="text-xs text-red-600 mt-1">{issueDateError}</p>
                )}
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

function CSVImportModal({
  currentUser,
  allUsers,
  onClose,
  onImport,
}: {
  currentUser: User | null;
  allUsers: User[];
  onClose: () => void;
  onImport: () => void;
}) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [assignTo, setAssignTo] = useState(currentUser?.id || '');

  const expectedHeaders = ['type', 'licenseNumber', 'state', 'issueDate', 'expiryDate'];
  const optionalHeaders = ['renewalLink', 'notes', 'isResidentState'];

  const parseCSV = (text: string): { rows: Record<string, string>[]; errors: string[] } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      return { rows: [], errors: ['CSV file must have a header row and at least one data row.'] };
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

    const parseErrors: string[] = [];
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      parseErrors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      return { rows: [], errors: parseErrors };
    }

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        parseErrors.push(`Row ${i}: expected ${headers.length} columns but found ${values.length}`);
        continue;
      }
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx].trim().replace(/^["']|["']$/g, '');
      });
      rows.push(row);
    }

    return { rows, errors: parseErrors };
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleFileSelect = (file: File) => {
    setCsvFile(file);
    setImportResult(null);
    setErrors([]);
    setParsedRows([]);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const { rows, errors: parseErrors } = parseCSV(text);
      setParsedRows(rows);
      setErrors(parseErrors);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setImporting(true);
    let success = 0;
    let failed = 0;
    const importErrors: string[] = [];

    parsedRows.forEach((row, index) => {
      try {
        const licenseData: License = {
          id: `lic-${Date.now()}-${index}`,
          userId: assignTo,
          type: row.type as License['type'],
          licenseNumber: row.licenseNumber,
          state: row.state,
          issueDate: row.issueDate,
          expiryDate: row.expiryDate,
          renewalLink: row.renewalLink || undefined,
          notes: row.notes || undefined,
          status: 'active',
          documents: [],
          isResidentState: row.isResidentState?.toLowerCase() === 'yes' || row.isResidentState?.toLowerCase() === 'true' || false,
        };

        if (!licenseData.licenseNumber || !licenseData.state || !licenseData.expiryDate) {
          importErrors.push(`Row ${index + 1}: Missing required fields`);
          failed++;
          return;
        }

        saveLicense(licenseData);
        success++;
      } catch {
        importErrors.push(`Row ${index + 1}: Failed to save`);
        failed++;
      }
    });

    setImportResult({ success, failed });
    setErrors(importErrors);
    setImporting(false);

    if (success > 0 && failed === 0) {
      setTimeout(() => onImport(), 1500);
    }
  };

  const downloadTemplate = () => {
    const header = [...expectedHeaders, ...optionalHeaders].join(',');
    const example = 'State Producer,CA-12345678,CA,2024-01-15,2026-01-15,https://example.com/renew,Primary license,no';
    const csvContent = `${header}\n${example}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Licenses from CSV</h2>
          <p className="text-sm text-gray-500 mb-6">Upload a CSV file to bulk import license information.</p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements</h4>
              <p className="text-xs text-blue-700 mb-2">
                Required columns: <span className="font-mono font-medium">{expectedHeaders.join(', ')}</span>
              </p>
              <p className="text-xs text-blue-700 mb-3">
                Optional columns: <span className="font-mono font-medium">{optionalHeaders.join(', ')}</span>
              </p>
              <button
                onClick={downloadTemplate}
                className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
              >
                Download template CSV
              </button>
            </div>

            {isAdmin(currentUser) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign imported licenses to
                </label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {allUsers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id="csv-upload"
                  accept=".csv"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <span className="text-4xl mb-2">📥</span>
                  <span className="text-sm text-gray-600">
                    {csvFile ? csvFile.name : 'Click to select a CSV file'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">.csv files only</span>
                </label>
              </div>
            </div>

            {parsedRows.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  Preview ({parsedRows.length} license{parsedRows.length !== 1 ? 's' : ''} found)
                </h4>
                <div className="max-h-48 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 pr-3 text-gray-500">Type</th>
                        <th className="text-left py-1 pr-3 text-gray-500">License #</th>
                        <th className="text-left py-1 pr-3 text-gray-500">State</th>
                        <th className="text-left py-1 pr-3 text-gray-500">Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-1 pr-3 text-gray-700">{row.type}</td>
                          <td className="py-1 pr-3 text-gray-700">{row.licenseNumber}</td>
                          <td className="py-1 pr-3 text-gray-700">{row.state}</td>
                          <td className="py-1 pr-3 text-gray-700">{row.expiryDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2">...and {parsedRows.length - 10} more</p>
                  )}
                </div>
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Issues</h4>
                <ul className="text-xs text-red-700 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {importResult && (
              <div className={`rounded-lg p-4 ${importResult.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm font-medium ${importResult.failed === 0 ? 'text-green-800' : 'text-yellow-800'}`}>
                  Imported {importResult.success} license{importResult.success !== 1 ? 's' : ''} successfully
                  {importResult.failed > 0 && `, ${importResult.failed} failed`}.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedRows.length === 0 || importing || (importResult !== null && importResult.failed === 0)}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing...' : `Import ${parsedRows.length} License${parsedRows.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
