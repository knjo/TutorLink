"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  bio: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: { bio: string }) => void;
}

export function BioForm({ bio, isEditing, onEdit, onCancel, onSave }: Props) {
  const [value, setValue] = useState(bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ bio: value });
  };

  if (!isEditing) {
    return (
      <div className="p-6 pt-0">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
        <div className="mt-6">
          <Button variant="outline" onClick={onEdit}>Edit Bio</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[120px]"
        placeholder="Tell us a little about yourself..."
      />
      <div className="flex gap-3">
        <Button type="submit">Save Bio</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}