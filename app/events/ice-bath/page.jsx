import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Ice Bath',
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect('/events');
}
