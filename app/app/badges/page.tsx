
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { BadgeGallery } from '../../components/badge-gallery';
import { authOptions } from '../../lib/auth';

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <BadgeGallery userId={session.user?.id || ''} />
    </div>
  );
}
