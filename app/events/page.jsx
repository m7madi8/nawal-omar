import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Events',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/local-retreats');
}
