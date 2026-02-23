import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { Shield, UserPlus, UserCheck, RefreshCw, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface Guest {
  email: string;
  approved: boolean;
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'opencrd1') {
      setIsAuthenticated(true);
      loadGuests();
    } else {
      setMessage('Invalid password');
    }
  };

  const loadGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6776d9ad/admin/get-guests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ adminPassword: 'opencrd1' })
        }
      );

      const data = await response.json();
      if (data.guests) {
        setGuests(data.guests);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
      setMessage('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6776d9ad/admin/add-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email: newEmail, adminPassword: 'opencrd1' })
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage(`✓ Added ${newEmail} to guest list`);
        setNewEmail('');
        loadGuests();
      }
    } catch (error) {
      console.error('Error adding email:', error);
      setMessage('Failed to add email');
    } finally {
      setLoading(false);
    }
  };

  const approveGuest = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6776d9ad/admin/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, adminPassword: 'opencrd1' })
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage(`✓ Approved ${email}`);
        loadGuests();
      }
    } catch (error) {
      console.error('Error approving guest:', error);
      setMessage('Failed to approve guest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage event guests and approvals</p>
          </div>

          <form onSubmit={handleLogin} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <label className="block text-gray-300 mb-3 font-semibold">Admin Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Login
            </button>
            {message && (
              <p className="mt-4 text-red-400 text-center">{message}</p>
            )}
          </form>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Password: Contact admin privately</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400"
          >
            {message}
          </motion.div>
        )}

        {/* Add Guest Form */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-500" />
            Add Guest Email
          </h2>
          <form onSubmit={addEmail} className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="guest@example.com"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Add Guest
            </button>
          </form>
        </div>

        {/* Guest List */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-500" />
              Guest List ({guests.length})
            </h2>
            <button
              onClick={loadGuests}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {guests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No guests added yet</p>
          ) : (
            <div className="space-y-3">
              {guests.map((guest) => (
                <div
                  key={guest.email}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${guest.approved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-white font-medium">{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {guest.approved ? (
                      <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-lg border border-green-500/30">
                        ✓ Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => approveGuest(guest.email)}
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all"
                      >
                        Approve Entry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-400 mb-3">How It Works</h3>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Add guest emails to the authorized list</li>
            <li>Guests enter their email on the main page</li>
            <li>They see "Waiting for Approval" message</li>
            <li>Click "Approve Entry" to grant access</li>
            <li>The page automatically transitions to the welcome screen with music</li>
          </ol>
        </div>
      </div>
    </div>
  );
}