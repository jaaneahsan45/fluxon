// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-gray-900">
      {/* Hero Section with Tailwind Animation */}
      <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_200%] animate-[gradient_8s_ease_infinite]">
        Fluxon
      </h1>

      <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl leading-relaxed">
        The next-generation DeFi ecosystem on Polygon.<br />
        Stake $FLX to earn rewards, boost your yield with legendary NFTs, and join a thriving community.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-8 mb-20">
        <Link
          href="/staking"
          className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
        >
          Open Dashboard
        </Link>
        <Link
          href="/marketplace"
          className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
        >
          Mint NFTs
        </Link>
      </div>

      {/* Project Details */}
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-left">
        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">High-Yield Staking</h3>
          <p className="text-gray-300">
            Stake $FLX to earn competitive rewards with NFT-powered yield boosts up to Legendary tier.
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Utility NFTs</h3>
          <p className="text-gray-300">
            Collect limited-edition Fluxon NFTs with real utility: staking boosts, tax reductions, and governance.
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Community Driven</h3>
          <p className="text-gray-300">
            Built for the community, by the community. Join us on our journey to redefine DeFi on Polygon.
          </p>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-12">
        <p className="text-xl text-gray-400 mb-6">Join the Fluxon Community</p>
        <div className="flex justify-center gap-10">
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
      </div>

      {/* Footer */}
      <footer className="text-gray-500 text-sm pb-8">
        © 2025 Fluxon. All rights reserved.
      </footer>
    </div>
  );
}