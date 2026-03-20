import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { DashboardClientLayout } from './DashboardClientLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}
