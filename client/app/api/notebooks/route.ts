import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Look up the internal user Id based on clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User mapping not found' }, { status: 404 });
    }

    // Create the notebook
    const notebook = await prisma.notebook.create({
      data: {
        title: name,
        description: description || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ data: notebook }, { status: 201 });
  } catch (error) {
    console.error('Error creating notebook:', error);
    return NextResponse.json(
      { error: 'Failed to create notebook' },
      { status: 500 }
    );
  }
}
