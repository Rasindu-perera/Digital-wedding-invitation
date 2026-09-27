'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function DownloadPdfButton({ guestName }: { guestName: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2pdf to prevent SSR "self is not defined" error
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('invitation-card');
      if (!element) throw new Error("Invitation card not found");

      const opt = {
        margin: 0,
        filename: `Invitation_${guestName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight] as [number, number], orientation: 'portrait' as const }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an issue downloading the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="mt-8 flex items-center justify-center gap-2 bg-[#b68c4a] hover:bg-[#a07a3c] text-white px-6 py-3 rounded-full font-sans tracking-wide transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      {downloading ? 'Generating PDF...' : 'Download Invitation as PDF'}
    </button>
  );
}
