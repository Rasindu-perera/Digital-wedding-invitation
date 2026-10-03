'use client';
import { useState } from 'react';

export default function RsvpForm({ guestId, initialStatus, initialCount }: { guestId: string, initialStatus: string, initialCount: number }) {
  const [status, setStatus] = useState(initialStatus || 'Pending');
  const [count, setCount] = useState(initialCount || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpStatus: status, guestCount: count })
      });
      if (res.ok) {
        setMessage('Thank you! Your RSVP has been confirmed.');
      } else {
        setMessage('Failed to submit RSVP. Please try again.');
      }
    } catch (e) {
      setMessage('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-[#f6f5f0] p-8 sm:p-12 rounded-[2rem] shadow-sm border border-white/80 text-center relative z-10">
      <h3 className="text-4xl font-script text-[#c49a45] mb-8">RSVP</h3>
      <div className="flex flex-col gap-4 mb-8 items-center">
        <label className="flex items-center gap-3 text-lg font-serif text-[#3d4c38] cursor-pointer transition hover:opacity-80">
          <input type="radio" name="rsvp" value="Attending" checked={status === 'Attending'} onChange={() => setStatus('Attending')} className="w-5 h-5 accent-[#828b7a]" />
          Joyfully Attending
        </label>
        <label className="flex items-center gap-3 text-lg font-serif text-[#3d4c38] cursor-pointer transition hover:opacity-80">
          <input type="radio" name="rsvp" value="Declined" checked={status === 'Declined'} onChange={() => setStatus('Declined')} className="w-5 h-5 accent-[#828b7a]" />
          Regretfully Declining
        </label>
      </div>

      {status === 'Attending' && (
        <div className="mb-8 flex flex-col items-center">
          <label className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#7a7a72] mb-3">Number of Guests</label>
          <input type="number" min="1" max="5" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-24 text-center rounded-xl border border-[#d5d4cd] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#828b7a] font-sans text-lg text-[#3d4c38]" />
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading} className="bg-[#828b7a] text-white px-10 py-4 rounded-full tracking-[0.2em] text-[10px] sm:text-xs uppercase shadow-md hover:bg-[#6e7766] transition disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit RSVP'}
      </button>

      {message && <p className="mt-6 text-[#3d4c38] font-medium font-sans animate-fade-in">{message}</p>}
    </div>
  );
}
