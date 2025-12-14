// src/app/book/[id]/page.tsx
"use client";

import { useState, useMemo, use } from "react";
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

type BookedSession = {
  tutorName: string;
  date: string;
  startTime: string;
  endTime: string;
};

export default function BookTimeSlotPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  const router = useRouter();

  const tutorProfile = tutors.find((t) => t.id === id);

  // State to store booked sessions
  const [bookedSlots, setBookedSlots] = useState<BookedSession[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const timeSlots = useMemo(() => {
    if (!tutorProfile) return [];
    return getTutorSlots(tutorProfile.id, selectedDate);
  }, [tutorProfile, selectedDate]);

  if (!tutorProfile) {
    return notFound();
  }

  // Helper: Calculate end time (Start time + 60 mins)
  const getEndTime = (startTime: string) => {
    const [h, m] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + 60);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSelectSlot = (index: number) => {
    const currentSlot = timeSlots[index];
    const nextSlot = timeSlots[index + 1];

    // Check if this is the last slot of the day
    if (!nextSlot) {
      toast.error("Unable to select slot", { 
        description: "Sessions require 1 hour. This is the last available slot." 
      });
      return;
    }

    // Check if the next slot is available (for 1-hour continuity)
    if (!nextSlot.available) {
      toast.error("Consecutive slot unavailable", { 
        description: "Sessions require 1 hour, but the next 30-minute slot is already booked." 
      });
      return;
    }

    setSelectedStartTime(currentSlot.time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedStartTime) return;

    const endTime = getEndTime(selectedStartTime);
    const dateStr = selectedDate.toLocaleDateString();

    const newSession: BookedSession = {
      tutorName: tutorProfile.name,
      date: dateStr,
      startTime: selectedStartTime,
      endTime: endTime
    };

    // Add to booked list
    setBookedSlots((prev) => [...prev, newSession]);

    // Show success message
    toast.success("Booking confirmed!", {
      description: `Session with ${tutorProfile.name} on ${dateStr} at ${selectedStartTime} is confirmed.`,
    });

    // Reset selection so user can book another
    setSelectedStartTime(null);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      toast.success("Subscribed!", { description: `You'll receive notifications about ${tutorProfile.name}'s schedule` });
    } else {
      toast.info("Unsubscribed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <Toaster />

      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tutors
        </Link>

        {/* Tutor Profile Card */}
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

        <div className="text-center mb-8">
             <h1 className="text-3xl font-bold mb-2">Book Your Tutor Session</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Calendar Section */}
          <Card className="lg:col-span-5 h-fit">
            <CardHeader>
              <CardTitle>Choose a Date</CardTitle>
              <CardDescription>Select a date to view available time slots</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedStartTime(null);
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>

          {/* Time Slots Section */}
          <Card className="lg:col-span-7 flex flex-col">
            <CardHeader>
              <CardTitle>Available Time Slots (1 Hour Session)</CardTitle>
              <CardDescription>
                {selectedDate
                  ? `Select a start time for ${selectedDate.toLocaleDateString()}`
                  : "Please select a date"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {selectedDate ? (
                <div className="space-y-6">
                  {/* Slot List */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {timeSlots.map((slot, index) => {
                      const isStart = selectedStartTime === slot.time;
                      const isNext = index > 0 && timeSlots[index - 1].time === selectedStartTime;
                      const isSelected = isStart || isNext;

                      return (
                        <Button
                          key={`${slot.time}-${index}`}
                          variant={isSelected ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => handleSelectSlot(index)}
                          className={`
                            relative h-12 
                            ${!slot.available ? "opacity-50" : ""}
                            ${isSelected ? "ring-2 ring-offset-2 ring-indigo-500 z-10" : ""}
                          `}
                        >
                          {slot.time}
                          {!slot.available && (
                            <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-xs font-medium text-muted-foreground rounded-md cursor-not-allowed">
                              Booked
                            </span>
                          )}
                        </Button>
                      );
                    })}
                    {timeSlots.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-8">
                            No slots available.
                        </div>
                    )}
                  </div>

                  {/* Confirmation Area */}
                  {selectedStartTime && (
                    <div className="mt-auto pt-6 border-t animate-in fade-in slide-in-from-bottom-4">
                      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-indigo-900">Booking Summary</p>
                            <p className="text-indigo-700">
                              {tutorProfile.name} • {selectedDate.toLocaleDateString()}
                            </p>
                            <p className="text-indigo-900 font-bold mt-1 text-lg">
                              {selectedStartTime} - {getEndTime(selectedStartTime)}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleBooking}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        >
                          Confirm 1-Hour Session
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

        {/* Booked Sessions List */}
        {bookedSlots.length > 0 && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Your Booked Sessions</CardTitle>
                <CardDescription>
                  You have {bookedSlots.length} upcoming session{bookedSlots.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookedSlots.map((booking, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-green-100 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.tutorName}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {booking.date} at {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="mt-2 sm:mt-0 bg-white text-green-700 border-green-200 shadow-sm">
                        Confirmed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
      </div>
    </div>
  );
}