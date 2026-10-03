import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DownloadPdfButton from './DownloadPdfButton';
import FallingPetals from '@/components/FallingPetals';
import EnvelopeWrapper from './EnvelopeWrapper';
import CountdownTimer from './CountdownTimer';
import RsvpForm from './RsvpForm';

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
    <EnvelopeWrapper id={id} guestName={guest.guestName}>
      <div className="min-h-screen bg-[#f1efe9] relative overflow-x-hidden font-sans pb-24">
        <FallingPetals />

        {/* Background Texture (subtle white gradient to mimic silk/fabric) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-white/20 to-transparent"></div>

        {/* HERO SECTION */}
        <section id="invitation-card" className="relative w-full min-h-screen flex flex-col xl:flex-row items-center justify-center p-4 sm:p-8 z-10 bg-[#f1efe9]">
          {/* Left Column: Typography */}
          <div className="w-full xl:w-1/2 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-10 py-12 xl:py-0">
            <p className="tracking-[0.25em] text-[#7a7a72] text-[10px] sm:text-xs uppercase">{settings.topText}</p>
            
            <div className="flex flex-col items-center justify-center -space-y-2 sm:-space-y-4">
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] xl:text-[7rem] text-[#3d4c38] font-serif uppercase tracking-widest font-normal">
                {settings.brideName}
              </h1>
              <span className="font-script text-[#c49a45] text-4xl sm:text-5xl lg:text-6xl -rotate-2 py-4">
                and
              </span>
              <h1 className="text-5xl sm:text-7xl lg:text-[6rem] xl:text-[7rem] text-[#3d4c38] font-serif uppercase tracking-widest font-normal">
                {settings.groomName}
              </h1>
            </div>

            <p className="tracking-[0.25em] text-[#7a7a72] text-[10px] sm:text-xs uppercase max-w-sm leading-relaxed px-4">
              {settings.midText}
            </p>

            {guest.guestName && (
              <div className="mt-8 py-2.5 px-8 rounded-full bg-[#828b7a] text-white tracking-[0.2em] text-[10px] sm:text-xs uppercase shadow-sm border border-white/20">
                {/* @ts-ignore */}
                {guest.salutation || 'Dear'} {guest.guestName}, YOU'RE INVITED ♡
              </div>
            )}
          </div>

          {/* Right Column: Envelope / Cards */}
          <div className="w-full xl:w-1/2 flex justify-center items-center mt-4 xl:mt-0 relative min-h-[500px]">
            <div className="relative w-full max-w-md xl:max-w-lg flex flex-col items-center">
               <img src="/images/flower-1.jpeg" className="absolute -top-12 -right-8 sm:-top-24 sm:-right-12 w-32 sm:w-48 object-contain mix-blend-multiply opacity-80 rotate-12 z-0" alt="Decoration" />
               <img src="/images/flower-3.jpeg" className="absolute -bottom-16 -left-8 sm:-bottom-32 sm:-left-16 w-40 sm:w-64 object-contain mix-blend-multiply opacity-60 -rotate-45 z-0" alt="Decoration" />

               {/* The Main Arch Card */}
               <div className="bg-[#edebe4] rounded-t-full rounded-b-[2rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-[1.5px] border-white/60 w-[85%] sm:w-80 text-center flex flex-col items-center relative z-10 backdrop-blur-sm">
                  <p className="tracking-[0.2em] text-[#6b7265] text-xs uppercase mb-6 font-medium">{settings.dateText}</p>
                  
                  <div className="w-12 h-12 rounded-full bg-[#828b7a] flex items-center justify-center shadow-inner mb-6 text-[#edebe4] border border-[#3d4c38]/20">
                     <span className="font-serif italic text-xl">
                       {settings.brideName.charAt(0)}&{settings.groomName.charAt(0)}
                     </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#3d4c38] font-serif mb-4">{settings.timeText}</p>
                  
                  <div className="text-[10px] sm:text-xs text-[#7a7a72] uppercase tracking-[0.15em] leading-loose">
                    <p className="font-medium text-[#3d4c38] mb-1">{settings.venueText}</p>
                    {settings.mapUrl ? (
                      <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[#c49a45] hover:text-[#3d4c38] underline decoration-[#c49a45]/40 underline-offset-4 transition-colors">
                        {settings.addressText}
                      </a>
                    ) : (
                      <p>{settings.addressText}</p>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN SECTION */}
        <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 z-10">
          <CountdownTimer />
        </section>

        {/* GALLERY SECTION */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-script text-[#c49a45] mb-2">Moments</h2>
            <p className="tracking-[0.3em] text-[#7a7a72] text-[10px] md:text-xs uppercase">A Glimpse into our story</p>
            <div className="w-16 h-[1px] bg-[#c49a45]/40 mx-auto mt-6"></div>
          </div>

          {/* Masonry/Grid Gallery Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="col-span-2 md:col-span-1 rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-md h-[22rem] md:h-[30rem] border border-white/50">
              <img src="/images/flower-4.jpeg" alt="Gallery 1" className="w-full h-full object-cover object-[center_30%] hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-1 rounded-[2rem] overflow-hidden shadow-md h-48 md:h-80 mt-0 md:mt-12 border border-white/50">
              <img src="/images/flower-2.jpeg" alt="Gallery 2" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-1 rounded-t-full rounded-b-2xl overflow-hidden shadow-md h-48 md:h-80 mt-0 border border-white/50">
              <img src="/images/flower-5.jpeg" alt="Gallery 3" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>

        {/* RSVP SECTION */}
        <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-8 py-20 z-10 mb-20">
          <RsvpForm guestId={id} initialStatus={guest.rsvpStatus} initialCount={guest.guestCount} />
        </section>

        {/* Floating Download PDF Button */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <DownloadPdfButton guest={guest} settings={settings} />
        </div>
      </div>
    </EnvelopeWrapper>
  );
}
