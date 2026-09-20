import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Ice Bath Experience',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/events');
}
