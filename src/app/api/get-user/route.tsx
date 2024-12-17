import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 

export async function POST(req: Request) {
  const { phone } = await req.json();

  try {
    const person = await prisma.user.findUnique({
      where: { phone },
    });

    if (!person) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(person, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
