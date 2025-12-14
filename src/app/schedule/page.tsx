// src/app/schedule/page.tsx
"use client";

import { useState, useMemo } from 'react';
import { generateMockClasses, ScheduleClass, CURRENT_USER_NAME } from '@/data/mock-schedule';
import { ScheduleView } from '@/app/schedule/_component/schedule-view';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap } from "lucide-react";

export default function SchedulePage() {
  const [classes, setClasses] = useState<ScheduleClass[]>(() => generateMockClasses());

  // 1. 篩選邏輯：把一個大陣列拆成兩個 View
  const takingClasses = useMemo(() => 
    classes.filter(c => c.studentName === CURRENT_USER_NAME), 
  [classes]);

  const teachingClasses = useMemo(() => 
    classes.filter(c => c.tutorName === CURRENT_USER_NAME), 
  [classes]);

  // 2. 處理操作 (共用邏輯)
  const handleCancel = (id: string) => {
    if(!confirm("Cancel this session?")) return;
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: 'cancelled' } : c));
    toast.info("Class cancelled");
  };

  const handleReschedule = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: 'reschedule-requested' } : c));
    toast.info("Reschedule request sent");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Schedule</h1>
          <p className="text-muted-foreground mt-1">
             Manage your learning journey and teaching sessions.
          </p>
        </div>

        {/* 使用 Tabs 來切換「上課」與「教課」 */}
        <Tabs defaultValue="attending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="attending" className="text-base gap-2">
              <BookOpen className="w-4 h-4" /> 
              Attending ({takingClasses.length})
            </TabsTrigger>
            <TabsTrigger value="teaching" className="text-base gap-2">
              <GraduationCap className="w-4 h-4" />
              Teaching ({teachingClasses.length})
            </TabsTrigger>
          </TabsList>

          {/* 學生視角：我要去上的課 */}
          <TabsContent value="attending" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-sm text-blue-700 mb-4 flex items-center">
                ℹ️ You are viewing classes where you are the <strong>&nbsp;Student</strong>.
            </div>
            <ScheduleView 
                mode="attending"
                classes={takingClasses} 
                onCancelClass={handleCancel}
                onRescheduleRequest={handleReschedule}
            />
          </TabsContent>

          {/* 老師視角：我要教的課 */}
          <TabsContent value="teaching" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-sm text-orange-800 mb-4 flex items-center">
                ℹ️ You are viewing classes where you are the <strong>&nbsp;Tutor</strong>.
            </div>
            <ScheduleView 
                mode="teaching"
                classes={teachingClasses} 
                onCancelClass={handleCancel}
                onRescheduleRequest={handleReschedule}
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}