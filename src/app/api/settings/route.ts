import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const defaultSettings = {
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

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: defaultSettings,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    // If DB fails (e.g. during build), return defaults so it doesn't crash
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Remove the id from the body if it exists, to safely update the rest
    const { id, ...updateData } = body;

    const newSettings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: updateData,
      create: { ...updateData, id: 'global' },
    });

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error) {
    console.error('Error writing settings:', error);
    return NextResponse.json({ error: 'Failed to write settings' }, { status: 500 });
  }
}
