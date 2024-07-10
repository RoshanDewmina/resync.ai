// app/page.tsx

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /overview when the root path is accessed
  redirect('/overview');
}
