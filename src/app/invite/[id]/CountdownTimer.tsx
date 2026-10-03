'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, targetTime }: { targetDate: string, targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Attempt to parse the admin dateText (e.g. "Saturday 12th December 2026")
    // Remove st, nd, rd, th to help the Date parser
    let cleanedDate = targetDate.replace(/\b(\d+)(st|nd|rd|th)\b/g, "$1");
    // Remove day of week (e.g. "Saturday") to avoid parsing confusion
    cleanedDate = cleanedDate.replace(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[\s,]*/i, "");
    
    // Parse time if it exists (e.g. "5pm" or "17:00")
    let timePart = "00:00:00";
    if (targetTime) {
      const timeMatch = targetTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const mins = timeMatch[2] || "00";
        const meridiem = timeMatch[3]?.toLowerCase();
        if (meridiem === 'pm' && hours < 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
        timePart = `${hours.toString().padStart(2, '0')}:${mins}:00`;
      }
    }

    let parsedDate = new Date(`${cleanedDate} ${timePart}`);
    
    // Fallback if the parser fails
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date("2026-12-12T17:00:00");
    }

    const target = parsedDate.getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return (
    <div className="flex justify-center gap-4 sm:gap-12 my-12 text-[#3d4c38] font-serif z-10 relative">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="text-4xl sm:text-6xl">{value}</span>
          <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#7a7a72] mt-2">{unit}</span>
        </div>
      ))}
    </div>
  );
}
