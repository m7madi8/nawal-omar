import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sound Healing',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/local-retreats');
}
