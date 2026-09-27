import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ReadTracker from './ReadTracker';
import DownloadPdfButton from './DownloadPdfButton';

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const guest = await prisma.guest.findUnique({
    where: { id },
  });

  if (!guest) {
    notFound();
  }

  // Load dynamic settings from Database
  let settings = await prisma.settings.findUnique({
    where: { id: 'global' },
  });

  if (!settings) {
    settings = {
      id: 'global',
      topText: 'Together with their families',
      brideName: 'Alex',
      groomName: 'Sam',
      midText: 'Joyfully invite you to their wedding celebration',
      dateText: 'Saturday 12th December 2026',
      timeText: '5pm Onwards',
      venueText: 'The Grand Venue, City Center',
      addressText: 'NJ, NY',
      mapUrl: '',
      dressCode: 'Dress Code: Formal Attire',
      rsvpText: 'RSVP by 1st November',
    };
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col items-center justify-center py-12 px-4 relative font-sans text-emerald-900">
      <ReadTracker id={id} />

      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        {/* The Card */}
        <div id="invitation-card" className="w-full bg-white shadow-[0_20px_50px_rgba(4,47,46,0.05)] p-8 md:p-12 flex flex-col relative overflow-hidden rounded-sm border border-emerald-50">
          
          {/* 1. Top Accent using user's provided image */}
          <div className="mb-6 flex justify-center">
            <img src="/images/flower-1.jpeg" alt="Floral Accent" className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-multiply opacity-90" />
          </div>

          {/* 2. Guest Greeting */}
          {guest.guestName && (
            <div className="text-center mb-6">
              <p className="text-sm md:text-base italic text-emerald-800">
                {/* @ts-ignore */}
                {guest.salutation || 'Dear'} {guest.guestName},
              </p>
            </div>
          )}

          {/* 3. Opening Line */}
          <div className="text-center mb-8">
            <p className="text-xs md:text-sm tracking-widest uppercase text-emerald-700/80 leading-loose">
              {settings.topText}
            </p>
          </div>

          {/* 4. The Couple */}
          <div className="py-2 flex flex-col items-center mb-8">
            <h1 className="font-script text-[#cda86b] text-5xl md:text-6xl font-normal leading-tight text-center">
              {settings.brideName}
            </h1>
            <span className="font-script text-emerald-800 text-3xl my-2">&</span>
            <h1 className="font-script text-[#cda86b] text-5xl md:text-6xl font-normal leading-tight text-center">
              {settings.groomName}
            </h1>
          </div>

          {/* Additional Mid Text (Joyfully invite...) */}
          <div className="text-center mb-8">
            <p className="text-xs md:text-sm tracking-widest uppercase text-emerald-700/80 leading-loose">
              {settings.midText}
            </p>
          </div>

          {/* 5. Date & Time */}
          <div className="text-center mb-8 border-y border-emerald-100 py-6">
            <p className="text-sm md:text-base tracking-widest text-emerald-900 font-medium mb-2 uppercase">
              {settings.dateText}
            </p>
            <p className="text-xs md:text-sm tracking-widest text-emerald-800/80 uppercase">
              {settings.timeText}
            </p>
          </div>

          {/* 6. Venue */}
          <div className="text-center mb-2">
            <p className="text-xs md:text-sm tracking-widest uppercase text-emerald-900 mb-2">{settings.venueText}</p>
            {settings.mapUrl ? (
              <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm tracking-widest uppercase text-[#cda86b] hover:text-emerald-700 underline decoration-emerald-200 underline-offset-4 transition-colors">
                {settings.addressText}
              </a>
            ) : (
              <p className="text-xs md:text-sm tracking-widest uppercase text-emerald-800/80">{settings.addressText}</p>
            )}
          </div>

        </div>

        {/* 7. Footer */}
        <div className="mt-8">
          <DownloadPdfButton guestName={guest.guestName} />
        </div>
      </div>
    </div>
  );
}
