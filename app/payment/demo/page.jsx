import { redirect } from 'next/navigation';

/** Demo checkout is disabled; all payments go through Hyp Pay. */
export default function Page() {
  redirect('/');
}
