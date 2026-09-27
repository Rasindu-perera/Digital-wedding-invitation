'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function EnvelopeWrapper({
  id,
  guestName,
  children,
}: {
  id: string;
  guestName?: string | null;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    // Mark as read in the background
    try {
      await axios.patch(`/api/guests/${id}/read`);
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="envelope"
            initial={{ y: 0 }}
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#828b7a] overflow-hidden"
          >
            {/* Envelope Side & Bottom Flaps */}
            <div 
              className="absolute inset-0 bg-[#747d6d]" 
              style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)' }} 
            />
            
            {/* Envelope Top Flap */}
            <div 
              className="absolute top-0 w-full h-[60%] bg-[#8e9885] origin-top shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
            />

            {/* Wax Seal Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c5a059] to-[#8c6414] shadow-[0_10px_25px_rgba(0,0,0,0.4)] border border-[#ffe066]/30 flex flex-col items-center justify-center text-white cursor-pointer group hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300"
            >
              {/* Inner ring for wax seal realism */}
              <div className="absolute inset-1.5 rounded-full border-[1.5px] border-[#ffe066]/20" />
              <div className="absolute inset-[10px] rounded-full border border-[#8c6414]/50 shadow-inner" />
              
              <span className="font-serif italic font-bold text-lg md:text-xl drop-shadow-md tracking-wider">
                Tap to Open
              </span>
            </motion.button>

            {guestName && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute bottom-12 md:bottom-20 text-center text-[#edebe4] z-10 font-serif tracking-widest uppercase text-xs md:text-sm drop-shadow-sm px-6"
              >
                <span className="text-[10px] md:text-xs opacity-70 block mb-2">Specially for</span>
                {guestName}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children behind the envelope, but lock scroll when envelope is closed */}
      <div className={!isOpen ? "h-screen overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}
