import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  X,
  Building,
  Mail
} from 'lucide-react';
import { MOCK_ADMIN_USERS } from '../../mocks';
import type { AdminUser, UserRole } from '../../types';
import { AdminHeader } from '../../components/layout/AdminHeader';

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('RESEARCHER');
  const [newInstitution, setNewInstitution] = useState('');
  const [newOrcid, setNewOrcid] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return u;
    }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().slice(0, 10),
      institution: newInstitution || 'Academic Research Affiliate',
      orcid: newOrcid || undefined
    };

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
    setNewFullName('');
    setNewEmail('');
    setNewRole('RESEARCHER');
    setNewInstitution('');
    setNewOrcid('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">ADMIN</span>;
      case 'PI':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">PRINCIPAL INVESTIGATOR</span>;
      case 'RESEARCHER':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">RESEARCHER</span>;
      case 'REVIEWER':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">REVIEWER / AUDITOR</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] overflow-y-auto select-text text-slate-900">
      {/* Global Admin Header */}
      <AdminHeader />

      {/* Top Banner / Section Header */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-slate-100 text-slate-800 rounded border border-slate-300">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Organization & User Management</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
                    UI-01
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage institutional accounts, grant role-based access control (RBAC), and oversee contributor statuses.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 500);
              }}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded hover:bg-slate-50 transition-colors bg-white text-slate-700"
            >
              Simulate Reload
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, or institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500">Role:</span>
              <select
                aria-label="Filter by Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="PI">Principal Investigator</option>
                <option value="RESEARCHER">Researcher</option>
                <option value="REVIEWER">Reviewer</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500">Status:</span>
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table (Stateful: Loading, Populated, Empty) */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          {isLoading ? (
            /* Loading Skeleton State */
            <div className="p-8 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 rounded w-1/4"></div>
              <div className="h-10 bg-slate-100 rounded"></div>
              <div className="h-10 bg-slate-100 rounded"></div>
              <div className="h-10 bg-slate-100 rounded"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">No matching users found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No organization members match your current filter criteria. Try clearing filters or add a new user.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); setStatusFilter('ALL'); }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Populated State */
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Institution & ORCID</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Joined Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {u.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{u.fullName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400 inline" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 align-middle">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Institution */}
                    <td className="py-3 px-4 align-middle">
                      <div className="text-slate-800 flex items-center space-x-1">
                        <Building className="w-3 h-3 text-slate-400 shrink-0 inline" />
                        <span className="truncate max-w-[200px]">{u.institution}</span>
                      </div>
                      {u.orcid && (
                        <div className="font-mono text-[10px] text-emerald-700 mt-0.5">
                          ORCID: {u.orcid}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 align-middle">
                      {u.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle className="w-3 h-3 mr-1 text-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 align-middle font-mono text-slate-500 text-[11px]">
                      {u.joinedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 align-middle text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <UserPlus className="w-4 h-4 text-slate-700" />
                <span>Add Institutional Member</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Email:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.doe@institution.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Permission:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="RESEARCHER">Researcher</option>
                    <option value="PI">Principal Investigator</option>
                    <option value="REVIEWER">Reviewer / Auditor</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ORCID iD (Optional):</label>
                  <input
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    value={newOrcid}
                    onChange={(e) => setNewOrcid(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affiliated Institution:</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford Medical Center"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                >
                  Create & Grant Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
