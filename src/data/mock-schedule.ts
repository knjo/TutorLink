// src/data/mock-schedule.ts

export interface ScheduleClass {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  studentName: string;
  tutorName: string;
  status: 'scheduled' | 'cancelled' | 'reschedule-requested';
  location: string;
}

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
};

// 假設當前登入的使用者是 "Alex Chen"
export const CURRENT_USER_NAME = "Alex Chen";

export const generateMockClasses = (): ScheduleClass[] => {
  return [
    // --- Alex 當學生 (去上課) ---
    {
      id: '1',
      subject: 'Advanced Python',
      date: getFutureDate(0).toISOString(),
      startTime: '10:00',
      endTime: '11:30',
      studentName: 'Alex Chen',     // Alex 是學生
      tutorName: 'Dr. Sarah Martinez',
      status: 'scheduled',
      location: 'Online'
    },
    {
      id: '2',
      subject: 'Piano Lesson',
      date: getFutureDate(2).toISOString(),
      startTime: '14:00',
      endTime: '15:00',
      studentName: 'Alex Chen',     // Alex 是學生
      tutorName: 'Ms. Melody Wu',
      status: 'scheduled',
      location: 'Music Room B'
    },

    // --- Alex 當老師 (去教課) ---
    {
      id: '3',
      subject: 'Mandarin Chinese - Beginner',
      date: getFutureDate(1).toISOString(),
      startTime: '09:00',
      endTime: '10:30',
      studentName: 'John Doe',
      tutorName: 'Alex Chen',       // Alex 是老師
      status: 'scheduled',
      location: 'Room 303'
    },
    {
      id: '4',
      subject: 'Mandarin Chinese - Intermediate',
      date: getFutureDate(1).toISOString(),
      startTime: '11:00',
      endTime: '12:30',
      studentName: 'Emily Smith',
      tutorName: 'Alex Chen',       // Alex 是老師
      status: 'scheduled',
      location: 'Room 303'
    },
    {
      id: '5',
      subject: 'Asian History',
      date: getFutureDate(3).toISOString(),
      startTime: '16:00',
      endTime: '17:30',
      studentName: 'David Wilson',
      tutorName: 'Alex Chen',       // Alex 是老師
      status: 'reschedule-requested',
      location: 'Online'
    },
  ];
};