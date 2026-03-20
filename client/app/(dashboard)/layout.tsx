import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { DashboardClientLayout } from './DashboardClientLayout';
import { prisma } from '@/lib/prisma';

async function getNotebooks(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return [];
  }

  return prisma.notebook.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
    }
  });
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const notebooks = await getNotebooks(userId);

  return (
    <DashboardClientLayout notebooks={notebooks}>
      {children}
    </DashboardClientLayout>
  );
}
