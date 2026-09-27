'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function DownloadPdfButton({ guest, settings }: { guest: any; settings: any }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('pdf-template');
      if (!element) throw new Error("PDF template not found");

      // Temporarily show the template off-screen so html2canvas can read it
      element.style.display = 'block';
      
      // Wait a tick for the browser to calculate layout dimensions
      await new Promise(resolve => setTimeout(resolve, 100));

      const opt = {
        margin: 0,
        filename: `Invitation_${guest?.guestName?.replace(/\s+/g, '_') || 'Guest'}.pdf`,
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().from(element).set(opt).save();
      
      // Hide it again
      element.style.display = 'none';
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an issue downloading the PDF. Please try again.");
      
      // Ensure it hides if it fails
      const element = document.getElementById('pdf-template');
      if (element) element.style.display = 'none';
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="mt-8 flex items-center justify-center gap-2 bg-[#828b7a] hover:bg-[#6e7766] text-white px-6 py-3 rounded-full font-sans tracking-widest text-xs uppercase shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition disabled:opacity-70 disabled:cursor-not-allowed border border-white/30 backdrop-blur-md"
      >
        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {downloading ? 'Generating PDF...' : 'Download Invitation'}
      </button>

      {/* HIDDEN PDF TEMPLATE - Uses display:none natively, moved offscreen during generation */}
      <div id="pdf-template" style={{ display: 'none', width: '794px', height: '1123px', position: 'absolute', top: '-20000px', left: '-20000px', zIndex: -9999, backgroundColor: '#f1efe9' }} className="font-sans overflow-hidden text-center">
        
        {/* Floral Corners */}
        <img src="/images/flower-1.jpeg" className="absolute -top-10 -right-10 w-[350px] object-contain mix-blend-multiply opacity-85 rotate-12" alt="Decoration" crossOrigin="anonymous" />
        <img src="/images/flower-3.jpeg" className="absolute -bottom-10 -left-10 w-[400px] object-contain mix-blend-multiply opacity-75 -rotate-45" alt="Decoration" crossOrigin="anonymous" />

        {/* Content Box */}
        <div className="absolute inset-10 border-2 border-[#828b7a]/30 rounded-3xl flex flex-col items-center justify-center p-12">
          
          <p className="tracking-[0.3em] text-[#7a7a72] text-sm uppercase mb-12">{settings.topText}</p>
          
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[7rem] text-[#3d4c38] font-serif uppercase tracking-widest font-normal leading-none">
              {settings.brideName}
            </h1>
            <span className="font-script text-[#c49a45] text-[5rem] -rotate-2 my-2 z-10">
              and
            </span>
            <h1 className="text-[7rem] text-[#3d4c38] font-serif uppercase tracking-widest font-normal leading-none">
              {settings.groomName}
            </h1>
          </div>

          <p className="tracking-[0.25em] text-[#7a7a72] text-sm uppercase max-w-lg leading-relaxed mt-12 mb-16">
            {settings.midText}
          </p>

          <div className="bg-[#edebe4] rounded-t-[100px] rounded-b-3xl p-10 shadow-lg border border-white w-[500px] flex flex-col items-center relative z-10">
            <p className="tracking-[0.2em] text-[#6b7265] text-sm uppercase mb-6 font-semibold">{settings.dateText}</p>
            
            <div className="w-16 h-16 rounded-full bg-[#828b7a] flex items-center justify-center shadow-inner mb-6 text-[#edebe4] border border-[#3d4c38]/20">
               <span className="font-serif italic text-2xl">
                 {settings.brideName.charAt(0)}&{settings.groomName.charAt(0)}
               </span>
            </div>

            <p className="text-xl text-[#3d4c38] font-serif mb-4">{settings.timeText}</p>
            
            <div className="text-xs text-[#7a7a72] uppercase tracking-[0.2em] leading-loose">
              <p className="font-semibold text-[#3d4c38] mb-1">{settings.venueText}</p>
              <p>{settings.addressText}</p>
            </div>
          </div>

          {guest.guestName && (
            <div className="mt-12 py-3 px-10 rounded-full bg-[#828b7a] text-white tracking-[0.25em] text-sm uppercase shadow-sm">
              {guest.salutation || 'Dear'} {guest.guestName}, YOU'RE INVITED ♡
            </div>
          )}

        </div>
      </div>
    </>
  );
}
