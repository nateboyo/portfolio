import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-josefin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nathan Garrovillas — Full-Stack Engineer',
  description: 'Portfolio of Nathan Garrovillas, full-stack software engineer based in Bay Shore, NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={josefin.variable}>
      <body>{children}</body>
    </html>
  );
}
