// src/app/layout.tsx
'use client';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <Providers>
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-6 left-6 z-50 lg:hidden p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed left-0 top-0 bottom-0 w-64 bg-gray-800 p-6 transition-transform duration-300 z-50
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
            `}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mb-12"
            >
              <h1 className="text-3xl font-bold text-cyan-400 text-center lg:text-left hover:text-cyan-300 transition-colors italic">
                Fluxon
              </h1>
            </Link>

            <nav className="space-y-4">
              {/* NEW: Join Presale Sidebar Item */}
              <a
                href="https://www.pinksale.finance/launchpad/polygon/0xDA1805582e9b778f7BaB2D07a6E923D5728e8618"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-4 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold shadow-lg hover:shadow-pink-500/20 transition-all hover:-translate-y-1 mb-6 border border-white/5"
              >
                <span className="text-xl">🔥</span>
                Join Presale
              </a>

              {/* Only show "Home" link when NOT on homepage */}
              {!isHomePage && (
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-all text-lg font-medium ${
                    pathname === '/' 
                      ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-600' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  Home
                </Link>
              )}

              <Link
                href="/staking"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-all text-lg font-medium ${
                  pathname === '/staking' 
                    ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-600' 
                    : 'hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-all text-lg font-medium ${
                  pathname === '/marketplace' 
                    ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-600' 
                    : 'hover:bg-gray-700'
                }`}
              >
                NFT Marketplace
              </Link>

              <a
                href="https://ipfs.io/ipfs/bafkreigijwu2jsx3ivfjrqshgndibyhjmizqybrcwbywkgi6urgdeji5oq"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-4 rounded-lg hover:bg-gray-700 transition-all text-lg font-medium"
              >
                Whitepaper
              </a>

              {/* SOCIAL LINKS SECTION */}
              <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Community</p>
                
                <a
                  href="https://t.me/+ZNIsQjlXDMg3NGJk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-all text-lg font-medium text-gray-300 hover:text-cyan-400"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.206 8.19l-1.745 8.227c-.13.585-.478.728-.967.453l-2.661-1.961-1.283 1.235c-.142.142-.261.261-.535.261l.191-2.711 4.935-4.458c.214-.19-.047-.296-.332-.106l-6.098 3.84-2.628-.82c-.572-.178-.583-.572.12-.843l10.264-3.959c.475-.172.891.112.734.882z"/>
                  </svg>
                  Telegram
                </a>

                <a
                  href="https://x.com/fluxonpulse" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-all text-lg font-medium text-gray-300 hover:text-cyan-400"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter)
                </a>
              </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6 text-sm text-gray-400 text-center lg:text-left">
              <p>© 2025 Fluxon</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:ml-64 min-h-screen p-8 pt-24 lg:pt-8">
            {children}
          </main>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 6000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid #374151',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}