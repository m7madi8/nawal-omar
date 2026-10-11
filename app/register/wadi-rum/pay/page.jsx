import { redirect } from 'next/navigation';

/** Booking is register + pay only — no standalone pay page. */
export default function Page() {
  redirect('/register/wadi-rum');
}
