"use client";

import { ScheduleClass } from "@/data/mock-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, CalendarX, RefreshCw, GraduationCap, BookOpen } from "lucide-react";

// Helper: 簡單格式化日期
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

interface Props {
  // mode 決定顯示邏輯：'attending' (我是學生) | 'teaching' (我是老師)
  mode: 'attending' | 'teaching'; 
  classes: ScheduleClass[];
  onCancelClass: (id: string) => void;
  onRescheduleRequest: (id: string) => void;
}

export function ScheduleView({ mode, classes, onCancelClass, onRescheduleRequest }: Props) {
  // 產生未來 7 天
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const getStatusBadge = (status: ScheduleClass['status']) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-green-600 hover:bg-green-700">Scheduled</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'reschedule-requested': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Check Required</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {next7Days.map((day) => {
        const dayClasses = classes.filter(c => {
          const classDate = new Date(c.date);
          return classDate.getDate() === day.getDate() && 
                 classDate.getMonth() === day.getMonth();
        });

        // 該日無課則不顯示該區塊，保持畫面乾淨 (Optional)
        if (dayClasses.length === 0) return null; 

        dayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div key={day.toISOString()} className="space-y-3">
            <h3 className="text-md font-semibold text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-foreground">{formatDate(day.toISOString())}</span>
            </h3>

            <div className="grid gap-3">
              {dayClasses.map((cls) => (
                <Card key={cls.id} className="overflow-hidden border-l-4 border-l-indigo-500 hover:shadow-md transition-all">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    {/* 左側：時間 */}
                    <div className="bg-slate-50 p-4 sm:w-28 flex flex-col justify-center items-center text-slate-700 border-r border-slate-100">
                      <span className="text-xl font-bold">{cls.startTime}</span>
                      <span className="text-xs text-muted-foreground">{cls.endTime}</span>
                    </div>

                    {/* 右側：詳細資訊 */}
                    <div className="p-4 flex-1 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           {getStatusBadge(cls.status)}
                           <h4 className="font-bold text-lg">{cls.subject}</h4>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {/* 根據模式顯示不同的圖示與文字 */}
                            {mode === 'attending' ? (
                                <>
                                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                                    <span>Tutor: <span className="font-medium text-foreground">{cls.tutorName}</span></span>
                                </>
                            ) : (
                                <>
                                    <User className="w-4 h-4 text-orange-600" />
                                    <span>Student: <span className="font-medium text-foreground">{cls.studentName}</span></span>
                                </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{cls.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      {cls.status === 'scheduled' && (
                        <div className="flex items-center sm:flex-col gap-2 justify-center border-t sm:border-t-0 sm:border-l sm:pl-4 mt-2 sm:mt-0 pt-2 sm:pt-0">
                           <Button variant="ghost" size="sm" onClick={() => onRescheduleRequest(cls.id)}>
                             <RefreshCw className="w-4 h-4 mr-2" /> Change
                           </Button>
                           <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onCancelClass(cls.id)}>
                             <CalendarX className="w-4 h-4 mr-2" /> Cancel
                           </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* 假如這週都沒課 */}
      {classes.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-muted-foreground">No classes scheduled in this view.</p>
          </div>
      )}
    </div>
  );
}