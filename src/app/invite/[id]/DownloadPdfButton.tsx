'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function DownloadPdfButton({ guest, settings }: { guest: any; settings: any }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2pdf to ensure window is defined
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('invitation-card');
      if (!element) throw new Error("Invitation card not found");

      const opt = {
        margin: 0,
        filename: `Invitation_${guest?.guestName?.replace(/\s+/g, '_') || 'Guest'}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
      className="mt-8 flex items-center justify-center gap-2 bg-[#828b7a] hover:bg-[#6e7766] text-white px-6 py-3 rounded-full font-sans tracking-widest text-xs uppercase shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition disabled:opacity-70 disabled:cursor-not-allowed border border-white/30 backdrop-blur-md"
    >
      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {downloading ? 'Generating PDF...' : 'Download Invitation'}
    </button>
  );
}
