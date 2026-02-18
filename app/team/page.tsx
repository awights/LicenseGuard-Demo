'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getUsers, saveUser, deleteUser, getLicenses, getAgency, saveAgency } from '@/lib/storage';
import { User, UserRole, Agency } from '@/lib/types';

export default function TeamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user || !isAdmin(user)) {
      return;
    }

    loadTeamData();
  }, []);

  const loadTeamData = () => {
    setUsers(getUsers());
    setAgency(getAgency());
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }

    const user = users.find(u => u.id === id);
    const userLicenses = getLicenses().filter(l => l.userId === id);

    if (userLicenses.length > 0) {
      if (!confirm(`${user?.name} has ${userLicenses.length} license(s). Delete user and all their licenses?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to remove ${user?.name} from the team?`)) {
        return;
      }
    }

    deleteUser(id);
    
    // Update agency seat count
    if (agency) {
      saveAgency({
        ...agency,
        currentSeats: Math.max(0, agency.currentSeats - 1),
      });
    }
    
    loadTeamData();
  };

  const handleSave = () => {
    setShowModal(false);
    loadTeamData();
  };

  if (!currentUser || !isAdmin(currentUser)) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-600">
              You need administrator privileges to manage team members.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 mt-2">Manage your agency team members</p>
            </div>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
              disabled={agency && agency.currentSeats >= agency.maxSeats}
            >
              <span className="mr-2">➕</span>
              Add Team Member
            </button>
          </div>
        </div>

        {/* Agency Info */}
        {agency && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {agency.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Plan Type</div>
                <div className="text-lg font-medium text-gray-900 capitalize">
                  {agency.planType}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Seats Used</div>
                <div className="text-lg font-medium text-gray-900">
                  {agency.currentSeats} / {agency.maxSeats}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(agency.currentSeats / agency.maxSeats) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Available Seats</div>
                <div className="text-lg font-medium text-gray-900">
                  {agency.maxSeats - agency.currentSeats}
                </div>
              </div>
            </div>
            {agency.currentSeats >= agency.maxSeats && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ You've reached your seat limit. Upgrade your plan to add more team members.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const userLicenses = getLicenses().filter(l => l.userId === user.id);
                const isCurrentUser = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-blue-600">(You)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role === 'admin' ? '👑 Admin' : '👤 Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userLicenses.length} license(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {!isCurrentUser && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Team Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Team Members</div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Licenses</div>
            <div className="text-3xl font-bold text-gray-900">{getLicenses().length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Avg Licenses per Member</div>
            <div className="text-3xl font-bold text-gray-900">
              {users.length > 0 ? (getLicenses().length / users.length).toFixed(1) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <TeamMemberModal
          user={editingUser}
          agency={agency}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

function TeamMemberModal({
  user,
  agency,
  currentUser,
  onClose,
  onSave,
}: {
  user: User | null;
  agency: Agency | null;
  currentUser: User;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: '',
      email: '',
      role: 'member',
      agencyId: currentUser.agencyId,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: User = {
      id: user?.id || `user-${Date.now()}`,
      name: formData.name || '',
      email: formData.email || '',
      role: formData.role as UserRole,
      agencyId: formData.agencyId || currentUser.agencyId,
    };

    saveUser(userData);

    // Update agency seat count if adding new user
    if (!user && agency) {
      saveAgency({
        ...agency,
        currentSeats: agency.currentSeats + 1,
      });
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {user ? 'Edit Team Member' : 'Add Team Member'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
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
                placeholder="john@agency.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="member">Team Member</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Admins can manage team members and view all licenses
              </p>
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
                {user ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
