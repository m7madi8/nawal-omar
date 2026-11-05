import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Local Retreats',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/local-retreats');
}
