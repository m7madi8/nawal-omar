import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Local Retreats',
  robots: { index: false, follow: false },
};

export default function ExperiencesPage() {
  redirect('/local-retreats');
}
