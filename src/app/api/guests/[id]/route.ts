import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // We only expect rsvpStatus and guestCount
    const { rsvpStatus, guestCount } = body;

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        ...(rsvpStatus && { rsvpStatus }),
        ...(guestCount !== undefined && { guestCount }),
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
