import type { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password for Free Fire Top Up BD account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ForgotPasswordClient />;
}