"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiBriefcase,
  FiBook,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiUpload
} from "react-icons/fi";
import { LuCircle } from "react-icons/lu";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

type UserProfile = {
  full_name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
  department: string;
  student_id: string;
  created_at: string;
  avatar_url: string;
  cover_url: string;
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
};

export default function SimpleProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>()
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    bio: "",
    department: "",
    student_id: "",
    created_at: "",
    avatar_url: "",
    cover_url: "",
    linkedin_url: "",
    twitter_url: "",
    github_url: ""
  });

  const [formData, setFormData] = useState<UserProfile>(profile);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile', { withCredentials: true });

      if (response.status == 200) {
        const data = response.data;
        console.log("User data: ", data)
        setProfile({
          full_name: data.user.full_name || "",
          email: data.user.email || "",
          role: data.user.role || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
          department: data.user.department || "",
          student_id: data.user.student_id || "",
          created_at: data.created_at || "",
          avatar_url: data.profile?.avatar_url || "",
          cover_url: data.profile?.cover_url || "",
          linkedin_url: data.profile?.linkedin_url || "",
          twitter_url: data.profile?.twitter_url || "",
          github_url: data.profile?.github_url || ""
        });
        setFormData({
          full_name: data.user.full_name || "",
          email: data.user.email || "",
          role: data.user.role || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
          department: data.user.department || "",
          student_id: data.user.student_id || "",
          created_at: data.created_at || "",
          avatar_url: data.profile?.avatar_url || "",
          cover_url: data.profile?.cover_url || "",
          linkedin_url: data.profile?.linkedin_url || "",
          twitter_url: data.profile?.twitter_url || "",
          github_url: data.profile?.github_url || ""
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };
  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files?.[0]
    if (!files) {
      setFile(null)
      return;
    }
    console.log("Profile Image: ", files)
    setFile(files)
    // create preview image
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(files)
  }
  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, val]) => {
        if (val && key !== 'file') form.append(key, val as string)
      })

      if (file) {
        form.append("avatar", file)
      }
      const response = await axios.put("/api/profile", form, {
        headers: { "Content-Type": "multipar/form-data" }
      })
      console.log("Form Data: ", formData)
      if (response.status == 200) {
        const data = response.data;
        setProfile({
          ...profile,
          ...data.user,
          linkedin_url: data.profile?.linkedin_url || "",
          twitter_url: data.profile?.twitter_url || "",
          github_url: data.profile?.github_url || ""
        });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
              <LuCircle className="text-amber-600 text-xl" />
            </div>
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">View and update your personal information</p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
              >
                <FiSave className="text-lg" />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditToggle}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-all"
              >
                <FiX className="text-lg" />
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <FiEdit2 className="text-lg" />
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b border-amber-50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                {/* Show preview image if exists, otherwise show saved image or initials */}
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-amber-600">
                    {getInitials(profile.full_name)}
                  </span>
                )}
              </div>

              {/* Upload Button - Shows only when editing */}
              {isEditing && (
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"  // Changed from "*" to "image/*" for better UX
                    className="hidden"
                    onChange={handleFillChange}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    title="Upload profile picture"
                  >
                    <FiUpload className="text-sm" />
                  </motion.div>
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.full_name || "No Name Set"}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-sm font-medium">
                  {profile.role || "User"}
                </span>
                {profile.student_id && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiBook className="text-amber-500" />
                    <span>ID: {profile.student_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FiCalendar className="text-amber-500" />
                  <span>Joined: {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-amber-50/30 to-yellow-50/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUser className="text-amber-500" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <FiMail className="text-amber-500" />
                      Email Address
                    </label>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <FiPhone className="text-amber-500" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.phone || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <FiMapPin className="text-amber-500" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.location || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-gradient-to-r from-blue-50/30 to-cyan-50/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-blue-500" />
                  Professional Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="Enter department"
                        className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{profile.department || "Not specified"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Bio */}
              <div className="bg-gradient-to-r from-green-50/30 to-emerald-50/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">About Me</h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={6}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profile.bio || "No bio provided yet."}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-r from-purple-50/30 to-pink-50/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Social Links</h3>
                <div className="space-y-3">
                  {[
                    { icon: <FiLinkedin />, platform: "LinkedIn", key: "linkedin_url", color: "text-blue-600" },
                    { icon: <FiTwitter />, platform: "Twitter", key: "twitter_url", color: "text-sky-500" },
                    { icon: <FiGithub />, platform: "GitHub", key: "github_url", color: "text-gray-800" }
                  ].map((social) => (
                    <div key={social.key} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white border ${social.color.replace('text', 'border')}`}>
                        <div className={social.color}>{social.icon}</div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-500">{social.platform}</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData[social.key as keyof UserProfile] as string}
                            onChange={(e) => handleInputChange(social.key as keyof UserProfile, e.target.value)}
                            placeholder={`Enter ${social.platform} URL`}
                            className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium text-sm truncate">
                            {profile[social.key as keyof UserProfile] as string || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Message about Images */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-lg">
            <FiEdit2 className="text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Profile Images</p>
            <p className="text-sm text-gray-600 mt-1">
              Profile picture and cover image features will be added soon. Currently focusing on basic profile information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}