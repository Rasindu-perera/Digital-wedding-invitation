import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guest = await prisma.guest.update({
      where: { id },
      data: { isOpened: true },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error updating read status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
