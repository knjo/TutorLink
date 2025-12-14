// src/app/account/page.tsx
"use client";

import { useState } from 'react';
import { mockUser } from '@/data/mock-user';
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// 引入我們剛做好的子元件
import { ProfileHeader } from '@/components/profile-header';
import { ProfileForm } from './_components/profile-form';
import { BioForm } from './_components/bio-form';
import { PasswordForm } from './_components/password-form';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AccountPage() {
  const [profileData, setProfileData] = useState(mockUser);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleProfileUpdate = (updates: Partial<typeof profileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
    setActiveSection(null);
    toast.success("Profile Updated", {
      description: "Your changes have been saved successfully."
    });
  };

  const handlePasswordUpdate = () => {
    setActiveSection(null);
    toast.success("Password Updated", {
      description: "Your password has been changed."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Toaster />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile information and preferences</p>
        </div>

        <div className="space-y-8">
          {/* 1. Header Section */}
          <ProfileHeader
            firstName={profileData.firstName}
            lastName={profileData.lastName}
            email={profileData.email}
            avatar={profileData.avatar}
            isStudent={profileData.isStudent}
            isTutor={profileData.isTutor}
          />

          {/* 2. Profile Information Section */}
          <Card>
            <CardHeader className="border-b bg-gray-50/30">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <div className="pt-6">
              <ProfileForm
                data={profileData}
                isEditing={activeSection === 'profile'}
                onEdit={() => setActiveSection('profile')}
                onCancel={() => setActiveSection(null)}
                onSave={handleProfileUpdate}
              />
            </div>
          </Card>

          {/* 3. Bio Section */}
          <Card>
            <CardHeader className="border-b bg-gray-50/30">
              <CardTitle>Bio</CardTitle>
              <CardDescription>Tell others about yourself</CardDescription>
            </CardHeader>
            <div className="pt-6">
              <BioForm
                bio={profileData.bio}
                isEditing={activeSection === 'bio'}
                onEdit={() => setActiveSection('bio')}
                onCancel={() => setActiveSection(null)}
                onSave={handleProfileUpdate}
              />
            </div>
          </Card>

          {/* 4. Password Section */}
          <Card>
            <CardHeader className="border-b bg-gray-50/30">
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <div className="pt-6">
              <PasswordForm
                isEditing={activeSection === 'password'}
                onEdit={() => setActiveSection('password')}
                onCancel={() => setActiveSection(null)}
                onSave={handlePasswordUpdate}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}