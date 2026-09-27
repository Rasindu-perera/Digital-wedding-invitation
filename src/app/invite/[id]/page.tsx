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
    <div className="min-h-screen bg-[#1c1917] flex flex-col items-center justify-center py-12 px-4 relative font-sans">
      <ReadTracker id={id} />

      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[rgba(205,168,107,0.2)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[rgba(205,168,107,0.1)] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center">
        {/* The Card */}
        <div id="invitation-card" className="w-full min-h-[600px] md:min-h-[700px] bg-[rgba(252,245,243,0.8)] backdrop-blur-sm shadow-2xl p-6 md:p-8 flex flex-col relative overflow-hidden">
          {/* Faux Texture for PDF rendering within the card */}
          <div className="absolute inset-0 z-[-1] pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_30%,_#ffe4e6_0%,_transparent_50%),_radial-gradient(circle_at_80%_80%,_#fff7ed_0%,_transparent_50%)] hidden print:block" />
          
          {/* Gold Border Frame */}
          <div className="flex-1 border-[1px] border-[#cda86b] p-6 md:p-8 relative flex flex-col items-center text-center justify-between z-10">
          
          {/* Corner Ornaments */}
          <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-2 border-l-2 border-[#cda86b]" />
          <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-2 border-r-2 border-[#cda86b]" />
          <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-2 border-l-2 border-[#cda86b]" />
          <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-2 border-r-2 border-[#cda86b]" />

          {/* Dots on borders */}
          <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#cda86b] rotate-45" />
          <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#cda86b] rotate-45" />
          <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#cda86b] rotate-45" />
          <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#cda86b] rotate-45" />

          {/* Top Section */}
          <div className="space-y-2 mt-4">
            <p className="text-[10px] md:text-xs tracking-[0.3em] text-[#b68c4a] uppercase">
              {settings.topText}
            </p>
            {guest.guestName && (
              <p className="text-xs text-[rgba(182,140,74,0.8)] italic mt-2">
                {/* @ts-ignore */}
                {guest.salutation || 'Dear'} {guest.guestName},
              </p>
            )}
          </div>

          {/* Main Title */}
          <div className="py-6 flex flex-col items-center">
            <h1 className="font-script text-[#b68c4a] text-6xl md:text-7xl lg:text-[5rem] leading-[0.7] -rotate-2 transform">
              {settings.brideName}
            </h1>
            <h1 className="font-script text-[#b68c4a] text-5xl md:text-6xl lg:text-[4rem] leading-[0.7] -rotate-2 transform my-2">
              &
            </h1>
            <h1 className="font-script text-[#b68c4a] text-6xl md:text-7xl lg:text-[5rem] leading-[0.7] ml-16 -rotate-2 transform mt-2">
              {settings.groomName}
            </h1>
          </div>

          {/* Details Section */}
          <div className="space-y-4 text-[#b68c4a] w-full mt-4">
            <div className="tracking-[0.2em] text-[10px] md:text-xs uppercase border-b border-[rgba(205,168,107,0.3)] pb-3 w-3/4 mx-auto leading-relaxed whitespace-pre-wrap">
              {settings.midText} <br/><br/>
              <span className="text-xs md:text-sm">{settings.dateText}</span>
            </div>

            <div className="space-y-1 text-xs md:text-sm">
              <p className="tracking-widest">{settings.timeText}</p>
              <p className="tracking-widest">{settings.venueText}</p>
              {settings.mapUrl ? (
                <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="tracking-widest hover:text-[#cda86b] underline decoration-[rgba(205,168,107,0.4)] underline-offset-4 transition-colors block">
                  {settings.addressText}
                </a>
              ) : (
                <p className="tracking-widest">{settings.addressText}</p>
              )}
            </div>

            <div className="text-xs md:text-sm tracking-widest pt-2">
              {settings.dressCode}
            </div>

            <div className="text-[10px] md:text-xs tracking-[0.2em] pt-4 uppercase">
              {settings.rsvpText}
            </div>
          </div>
        </div>
        </div>

        {/* Download Button */}
        <DownloadPdfButton guestName={guest.guestName} />
      </div>
    </div>
  );
}
