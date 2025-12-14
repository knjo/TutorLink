// src/app/book/[id]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Bell, BellOff, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

// 引入資料
import { tutors } from "@/data/mock-tutors"; // 導師基本資料
import { getTutorSlots } from "@/data/mock-tutors_time"; // 導師時段資料

// 引入 UI 元件
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";

export default function BookTimeSlotPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // 1. 先嘗試抓取導師資料 (這不是 Hook，只是普通變數，可以放這裡)
  const tutorProfile = tutors.find((t) => t.id === params.id);

  // 2. 🔥 修正重點：所有的 Hooks 都在這裡宣告，不能被 return 中斷
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // useMemo 也要放在這。因為 tutorProfile 可能是 undefined，裡面加個防呆機制
  const timeSlots = useMemo(() => {
    if (!tutorProfile) return [];
    return getTutorSlots(tutorProfile.id, selectedDate);
  }, [tutorProfile, selectedDate]);

  // 3. 🔥 修正重點：Hooks 都宣告完之後，才執行條件判斷與 return
  if (!tutorProfile) {
    return notFound();
  }

  // ---------------- 以下邏輯不變 ----------------

  // 處理預約邏輯
  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) return;

    toast.success("Booking Confirmed!", {
      description: `Session with ${tutorProfile.name} on ${selectedDate.toLocaleDateString()} at ${selectedSlot}`,
    });

    // 模擬延遲跳轉回首頁
    setTimeout(() => router.push('/'), 2000);
  };

  // 處理訂閱邏輯
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      toast.success("Subscribed!", {
        description: `You'll receive notifications about ${tutorProfile.name}'s schedule`,
      });
    } else {
      toast.info("Unsubscribed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {/* Toaster 確保通知會顯示 */}
      <Toaster />

      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tutors
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Tutor Session</h1>
          <p className="text-muted-foreground">
            Choose a date and pick your preferred time slot
          </p>
        </div>

        {/* Tutor Profile Section */}
        <Card className="mb-8 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                <AvatarImage src={tutorProfile.image} alt={tutorProfile.name} className="object-cover" />
                <AvatarFallback>{tutorProfile.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">{tutorProfile.name}</h2>
                <p className="text-muted-foreground mb-2">
                  {tutorProfile.subjects.join(", ")}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Badge variant="secondary" className="px-3 py-1">⭐ {tutorProfile.rating}</Badge>
                  {isSubscribed && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      <Bell className="w-3 h-3 mr-1" />
                      Subscribed
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant={isSubscribed ? "outline" : "default"}
                onClick={handleSubscribe}
                className="w-full md:w-auto"
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="w-4 h-4 mr-2" /> Unsubscribe
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" /> Subscribe Updates
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Calendar Section */}
          <Card className="lg:col-span-5 h-fit">
            <CardHeader>
              <CardTitle>Choose a Date</CardTitle>
              <CardDescription>
                Select a date to view available time slots
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null); // 換日期時清空已選時段
                }}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>

          {/* Time Slots Section */}
          <Card className="lg:col-span-7 flex flex-col">
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>
                {selectedDate
                  ? `Showing slots for ${selectedDate.toLocaleDateString()}`
                  : "Please select a date"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {selectedDate ? (
                <div className="space-y-6">
                  {/* 時段列表 */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {timeSlots.map((slot, idx) => (
                      <Button
                        key={`${slot.time}-${idx}`}
                        variant={
                          selectedSlot === slot.time
                            ? "default"
                            : "outline"
                        }
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`relative h-12 ${!slot.available ? "opacity-50" : ""}`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-xs font-medium text-muted-foreground rounded-md cursor-not-allowed">
                            Booked
                          </span>
                        )}
                      </Button>
                    ))}
                    {timeSlots.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-8">
                            No slots available.
                        </div>
                    )}
                  </div>

                  {/* 確認區域 */}
                  {selectedSlot && (
                    <div className="mt-auto pt-6 border-t animate-in fade-in slide-in-from-bottom-4">
                      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-indigo-900">Booking Summary</p>
                            <p className="text-indigo-700">
                              {tutorProfile.name} • {selectedDate.toLocaleDateString()} • {selectedSlot}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleBooking}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                  <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
                  <p>Select a date to see availability</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}