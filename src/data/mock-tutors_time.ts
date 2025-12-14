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

// Helper: 產生 30 分鐘間隔的時段
// 這裡多傳入 date 和 tutorId 來做為產生隨機數的種子
const generateDailySlots = (dateStr: string, tutorId: string) => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;

  // 1. 先產生乾淨的時間表
  for (let hour = startHour; hour < endHour; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    slots.push({ time: `${hourStr}:00`, available: true });
    slots.push({ time: `${hourStr}:30`, available: true });
  }
  slots.push({ time: `${endHour}:00`, available: true });

  // 2. 模擬預約邏輯 (使用確定性算法代替 Math.random)
  // 我們利用 Date 字串的最後一個字元 + tutorId + hour 來決定是否被預約
  // 這樣每次重新整理，只要日期跟人一樣，結果就會一樣
  const dateSeed = dateStr.charCodeAt(dateStr.length - 1); 
  const idSeed = parseInt(tutorId) || 1;

  for (let i = 0; i < slots.length - 1; i++) {
    // 取得小時的數字 (e.g., "09:30" -> 9)
    const currentHour = parseInt(slots[i].time.split(':')[0]);
    const currentMinute = parseInt(slots[i].time.split(':')[1]);
    
    // 🧮 偽隨機邏輯：混合各種數字來決定是否 available
    // 例如：(日期參數 + ID + 小時 + 分鐘) 除以 7 的餘數如果小於 2，就當作被預約
    const seed = dateSeed + idSeed + currentHour + (currentMinute / 10);
    const isBooked = (seed % 5) < 1; 

    if (isBooked) {
      slots[i].available = false;
      
      // 連鎖佔用下一個時段
      if (i + 1 < slots.length) {
        slots[i + 1].available = false;
      }
    }
  }

  return slots.slice(0, slots.length - 1);
};

// 產生 Mock Data
// 注意：我們改為動態生成，不先寫死在陣列裡，以免日期過期
export const tutorsTime: TutorAvailability[] = []; 

// 修改 getTutorSlots 函式，直接動態計算
export function getTutorSlots(tutorId: string, date: Date | undefined): TimeSlot[] {
  if (!date) return [];
  const dateStr = date.toISOString().split('T')[0];
  
  // 每次呼叫都用相同的算法產生
  return generateDailySlots(dateStr, tutorId);
}