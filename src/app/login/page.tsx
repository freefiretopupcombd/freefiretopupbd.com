import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account to buy game top-ups.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <LoginClient />;
}