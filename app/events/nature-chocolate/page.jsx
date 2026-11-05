import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Nature & Chocolate',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/local-retreats');
}
