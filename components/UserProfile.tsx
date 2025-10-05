"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  MapPin, 
  Save, 
  Edit3, 
  Camera,
  Shield,
  Bell,
  Palette,
  Globe,
  Upload,
  X
} from "lucide-react";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    country: string | null;
    avatar_url: string | null;
  };
}

export default function UserProfile({ user: initialUser }: UserProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    watchlistCount: 0,
    alertsCount: 0,
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: false,
    darkMode: true,
  });
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUser.name,
    email: initialUser.email,
    country: initialUser.country || '',
  });

  // Fetch user statistics and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, settingsResponse] = await Promise.all([
          fetch('/api/profile/stats'),
          fetch('/api/profile/settings')
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update user profile in Supabase
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUser(prev => ({ ...prev, ...formData }));
        setIsEditing(false);
        // Show success message
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      country: user.country || '',
    });
    setIsEditing(false);
  };

  const handleSettingChange = async (setting: string, value: boolean) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);

    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [setting]: value }),
      });

      if (!response.ok) {
        // Revert on error
        setSettings(settings);
        alert('Failed to update setting. Please try again.');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert on error
      setSettings(settings);
      alert('Failed to update setting. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setShowUploadModal(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { avatarUrl } = await response.json();
        setUser(prev => ({ ...prev, avatar_url: avatarUrl }));
        alert('Profile picture updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(`Failed to upload profile picture: ${error.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl border border-gray-700 p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-2xl font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={() => setShowUploadModal(true)}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 border-2 border-gray-800 transition-colors"
              title="Change profile picture"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
              ) : (
                <Camera className="h-4 w-4 text-gray-300" />
              )}
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-100 mb-1">{user.name}</h2>
            <p className="text-gray-400 mb-2">{user.email}</p>
            {user.country && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{user.country}</span>
              </div>
            )}
            <div className="mt-4">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-100">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-100">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-100">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter your country"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-100">{user.country || 'Not specified'}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-100">Account Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-100 font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive market updates and alerts</p>
                </div>
              </div>
              <button 
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.emailNotifications ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.emailNotifications ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-100 font-medium">Public Profile</p>
                  <p className="text-gray-400 text-sm">Make your profile visible to others</p>
                </div>
              </div>
              <button 
                onClick={() => handleSettingChange('publicProfile', !settings.publicProfile)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.publicProfile ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.publicProfile ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-100 font-medium">Dark Mode</p>
                  <p className="text-gray-400 text-sm">Always use dark theme</p>
                </div>
              </div>
              <button 
                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.darkMode ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.darkMode ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl border border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-5 w-5 bg-yellow-500 rounded"></div>
          <h3 className="text-lg font-semibold text-gray-100">Account Statistics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-100">{stats.watchlistCount}</p>
            <p className="text-gray-400 text-sm">Stocks in Watchlist</p>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-100">{stats.alertsCount}</p>
            <p className="text-gray-400 text-sm">Price Alerts</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Change Profile Picture</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Choose a new profile picture. Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>

              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Choose Image
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
