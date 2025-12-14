// src/data/tutors_time.ts

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type TutorAvailability = {
  tutorId: string;
  date: string;
  slots: TimeSlot[];
};

// Helper: 產生 30 分鐘間隔的時段 (09:00 - 17:00)
const generateDailySlots = (availableRatio: number = 0.7) => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 20;

  // 1. 先產生乾淨的時間表 (09:00, 09:30, 10:00...)
  for (let hour = startHour; hour < endHour; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    slots.push({ time: `${hourStr}:00`, available: true });
    slots.push({ time: `${hourStr}:30`, available: true });
  }
  // 加入最後一個 17:00 (通常不接客，但視為結束時間，這裡先加進去作為邊界)
  slots.push({ time: `${endHour}:00`, available: true });

  // 2. 模擬隨機預約邏輯 (Mock Logic)
  // 規則：如果這個時段被預約了，那它必定是 1 小時的課程，所以下一個時段也要被佔用
  for (let i = 0; i < slots.length - 1; i++) {
    // 每個時段有一定機率變成「被預約」
    // 我們只在偶數或特定間隔檢查，避免過於密集的隨機覆蓋
    if (Math.random() > availableRatio) {
      slots[i].available = false;
      
      // 若 A 被預約，下一個 (A+30min) 也必須被佔用
      if (i + 1 < slots.length) {
        slots[i + 1].available = false;
      }
    }
  }

  // 移除最後一個 17:00，因為通常不會有人預約 17:00 開始 (會上到 18:00)
  // 如果你希望最晚可以約 17:00，就保留，但這裡我們把 17:00 當作最後邊界移除
  return slots.slice(0, slots.length - 1);
};

// 產生 Mock Data
export const tutorsTime: TutorAvailability[] = [
  {
    tutorId: "1",
    date: new Date().toISOString().split('T')[0],
    slots: generateDailySlots(0.8)
  },
  {
    tutorId: "1",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    slots: generateDailySlots(0.6)
  },
  {
    tutorId: "2",
    date: new Date().toISOString().split('T')[0],
    slots: generateDailySlots(0.9)
  }
];

export function getTutorSlots(tutorId: string, date: Date | undefined): TimeSlot[] {
  if (!date) return [];
  const dateStr = date.toISOString().split('T')[0];
  const found = tutorsTime.find(t => t.tutorId === tutorId && t.date === dateStr);
  if (!found) {
    return generateDailySlots(0.7); 
  }
  return found.slots;
}