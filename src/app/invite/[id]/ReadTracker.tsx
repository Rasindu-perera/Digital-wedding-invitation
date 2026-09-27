'use client';

import { useEffect } from 'react';
import axios from 'axios';

export default function ReadTracker({ id }: { id: string }) {
  useEffect(() => {
    // Send PATCH request silently in the background
    const markAsRead = async () => {
      try {
        await axios.patch(`/api/guests/${id}/read`);
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    };
    
    markAsRead();
  }, [id]);

  return null;
}
