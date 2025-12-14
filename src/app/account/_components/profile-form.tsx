"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  data: UserData;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: Partial<UserData>) => void;
}

export function ProfileForm({ data, isEditing, onEdit, onCancel, onSave }: Props) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isEditing) {
    return (
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Full Name</div>
            <div className="text-gray-900">{data.firstName} {data.lastName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Email Address</div>
            <div className="text-gray-900">{data.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Phone Number</div>
            <div className="text-gray-900">{data.phone}</div>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" onClick={onEdit}>Edit Details</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}