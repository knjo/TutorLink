// src/data/tutors_time.ts

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type TutorAvailability = {
  tutorId: string;
  date: string; // 格式: YYYY-MM-DD
  slots: TimeSlot[];
};

// 產生一些預設時段的 Helper (不用每次手打)
const generateDailySlots = (availableRatio: number = 0.7) => {
  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  return times.map(t => ({
    time: t,
    available: Math.random() < availableRatio // 隨機設定是否可預約
  }));
};

// 這裡模擬 id 為 "1" (Sarah) 和 "2" (Michael) 的未來幾天資料
export const tutorsTime: TutorAvailability[] = [
  {
    tutorId: "1",
    date: new Date().toISOString().split('T')[0], // 今天
    slots: generateDailySlots(0.8)
  },
  {
    tutorId: "1",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 明天
    slots: generateDailySlots(0.5)
  },
  {
    tutorId: "2",
    date: new Date().toISOString().split('T')[0],
    slots: generateDailySlots(0.9)
  }
];

// Helper: 取得特定導師、特定日期的時段
export function getTutorSlots(tutorId: string, date: Date | undefined): TimeSlot[] {
  if (!date) return [];
  const dateStr = date.toISOString().split('T')[0];
  
  const found = tutorsTime.find(t => t.tutorId === tutorId && t.date === dateStr);
  
  // 如果資料庫沒資料，回傳預設空或自動生成(這裡示範回傳預設時段)
  if (!found) {
    return generateDailySlots(0.6); 
  }
  return found.slots;
}