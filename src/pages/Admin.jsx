import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Coins, Plus, Trash2, Edit, Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await base44.auth.me();
        setCurrentUser(user);
        
        if (user.role === 'admin') {
            const allUsers = await base44.entities.User.list();
            setUsers(allUsers);
        }
    };

    const handleAddCredits = async (userEmail, amount) => {
        const user = users.find(u => u.email === userEmail);
        await base44.entities.User.update(user.id, {
            credits: (user.credits || 0) + amount
        });
        
        await base44.entities.CreditTransaction.create({
            user_email: userEmail,
            amount: amount,
            transaction_type: 'bonus',
            description: `Admin added ${amount} credits`
        });
        
        loadData();
    };

    const handleRemoveCredits = async (userEmail, amount) => {
        const user = users.find(u => u.email === userEmail);
        const newCredits = Math.max(0, (user.credits || 0) - amount);
        
        await base44.entities.User.update(user.id, {
            credits: newCredits
        });
        
        await base44.entities.CreditTransaction.create({
            user_email: userEmail,
            amount: -amount,
            transaction_type: 'consumption',
            description: `Admin removed ${amount} credits`
        });
        
        loadData();
    };

    const handleChangeRole = async (userId, newRole) => {
        await base44.entities.User.update(userId, { role: newRole });
        loadData();
    };

    const handleInviteUser = async (email, role) => {
        await base44.users.inviteUser(email, role);
        alert(`Invitation sent to ${email}`);
        setShowAddUser(false);
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-8 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access Required</h2>
                    <p className="text-slate-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-mint-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                            <Shield className="w-10 h-10 text-purple-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600">Manage users, credits, and platform features</p>
                    </div>
                    <Button
                        onClick={() => setShowAddUser(true)}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Invite User
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <Users className="w-12 h-12 text-purple-600" />
                            <div>
                                <div className="text-3xl font-bold text-slate-800">{users.length}</div>
                                <div className="text-slate-600">Total Users</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <Coins className="w-12 h-12 text-blue-600" />
                            <div>
                                <div className="text-3xl font-bold text-slate-800">
                                    {users.reduce((sum, u) => sum + (u.credits || 0), 0)}
                                </div>
                                <div className="text-slate-600">Total Credits</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <Shield className="w-12 h-12 text-green-600" />
                            <div>
                                <div className="text-3xl font-bold text-slate-800">
                                    {users.filter(u => u.role === 'admin').length}
                                </div>
                                <div className="text-slate-600">Admins</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users by email or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-lg border border-slate-200 focus:outline-none focus:border-purple-400"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">User</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-left">Credits</th>
                                <th className="px-6 py-4 text-left">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-slate-800">{user.full_name}</div>
                                            <div className="text-sm text-slate-600">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 border-none"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800">{user.credits || 0}</span>
                                            <button
                                                onClick={() => {
                                                    const amount = prompt('Add credits (enter positive number):');
                                                    if (amount) handleAddCredits(user.email, parseInt(amount));
                                                }}
                                                className="p-1 hover:bg-green-100 rounded text-green-600"
                                                title="Add credits"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const amount = prompt('Remove credits (enter positive number):');
                                                    if (amount) handleRemoveCredits(user.email, parseInt(amount));
                                                }}
                                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                                title="Remove credits"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(user.created_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowEditUser(true);
                                            }}
                                            className="text-purple-600 hover:text-purple-700"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                {showAddUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Invite New User</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const email = e.target.email.value;
                                    const role = e.target.role.value;
                                    handleInviteUser(email, role);
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                                    <select
                                        name="role"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-400"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                        Send Invitation
                                    </Button>
                                    <Button type="button" onClick={() => setShowAddUser(false)} variant="outline">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditUser && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Edit User</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="text"
                                        value={selectedUser.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-slate-100 rounded-2xl border border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Credits</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={selectedUser.credits || 0}
                                            disabled
                                            className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl border border-slate-200"
                                        />
                                        <Button
                                            onClick={() => {
                                                const amount = prompt('Set new credit amount:');
                                                if (amount) {
                                                    const diff = parseInt(amount) - (selectedUser.credits || 0);
                                                    if (diff > 0) {
                                                        handleAddCredits(selectedUser.email, diff);
                                                    } else if (diff < 0) {
                                                        handleRemoveCredits(selectedUser.email, Math.abs(diff));
                                                    }
                                                    setShowEditUser(false);
                                                }
                                            }}
                                        >
                                            Set
                                        </Button>
                                    </div>
                                </div>
                                <Button onClick={() => setShowEditUser(false)} variant="outline" className="w-full">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}