"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function PasswordForm({ isEditing, onEdit, onCancel, onSave }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Mock DB Password
  const MOCK_DB_PASSWORD = "123456";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (currentPassword !== MOCK_DB_PASSWORD) {
      setError("Incorrect current password (Try: 123456)");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

    // Success
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onSave(); 
  };

  const handleCancel = () => {
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onCancel();
  };

  if (!isEditing) {
    return (
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Password</div>
            <div className="text-sm text-muted-foreground">********</div>
          </div>
          <Button variant="outline" onClick={onEdit}>Change Password</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
      {error && (
        <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md border border-red-200 animate-in fade-in slide-in-from-top-1">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input 
          id="current-password" 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password (try: 123456)"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input 
          id="new-password" 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          className={newPassword !== confirmPassword && confirmPassword ? "border-red-300 focus-visible:ring-red-300" : ""}
        />
        {newPassword !== confirmPassword && confirmPassword && (
           <p className="text-[10px] text-red-500 font-medium">Passwords do not match</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit">Update Password</Button>
        <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  );
}