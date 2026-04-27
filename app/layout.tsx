import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { getMenu } from '@/lib/drupal/menu';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DrupalConf 2026',
  description: 'The premier Drupal conference',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menu, footerMenu] = await Promise.all([
    getMenu('main').catch(() => []),
    getMenu('footer').catch(() => []),
  ]);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable}`}>
        <div className="app-layout">
          <Header menu={menu} />
          <main className="app-layout__main">
            {children}
          </main>
          <Footer menu={footerMenu} />
        </div>
      </body>
    </html>
  );
}
