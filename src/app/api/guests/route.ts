import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, phoneNumber, salutation } = body;

    if (!guestName || !phoneNumber) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const baseSlug = guestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const customId = baseSlug ? `${baseSlug}-${uniqueSuffix}` : uniqueSuffix;

    const guest = await prisma.guest.create({
      data: {
        id: customId,
        guestName,
        phoneNumber,
        salutation: salutation || null,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
