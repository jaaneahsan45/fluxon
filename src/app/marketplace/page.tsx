// src/app/marketplace/page.tsx
'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NFT_ADDRESS = '0x74643E4D2Ef45Bf7Bca9F251C75d25678442218C' as `0x${string}`;
const MAX_NFTS = 500;
const BASE_IMAGE_URL = 'https://ipfs.io/ipfs/bafybeialcvwyzpyaoskn5waqj4vp7s7mlieaf35yl7tiufwpt6tbtmq3ye/';
const PAGE_SIZE = 50;

const NFT_ABI = [
  {"inputs":[],"name":"saleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"mintPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},
] as const;

function getRarity(tokenId: number): 'Legendary' | 'Rare' | 'Common' {
  if (tokenId <= 50) return 'Legendary';
  if (tokenId <= 200) return 'Rare';
  return 'Common';
}

function getImageUrl(tokenId: number): string {
  const rarity = getRarity(tokenId);
  const padded = String(tokenId).padStart(3, '0');
  return `${BASE_IMAGE_URL}${rarity}/FluxonCoin_${padded}.png`;
}

const rarityColors = {
  Legendary: 'from-yellow-400 to-orange-500',
  Rare: 'from-blue-400 to-cyan-400',
  Common: 'from-gray-400 to-gray-600',
};

const rarityBorder = {
  Legendary: 'border-yellow-400 shadow-yellow-400/50',
  Rare: 'border-blue-400 shadow-blue-400/50',
  Common: 'border-gray-400 shadow-gray-400/50',
};

export default function NFTMarketplace() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'Legendary' | 'Rare' | 'Common'>('Legendary');
  const [filter, setFilter] = useState<'All' | 'Minted' | 'Unminted'>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mintedIds, setMintedIds] = useState<Set<number>>(new Set());
  const [totals, setTotals] = useState({ Legendary: 0, Rare: 0, Common: 0 });

  const { data: saleActive } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'saleActive',
  });

  const { writeContractAsync, isPending } = useWriteContract();

  // Fetch minted NFTs
  useEffect(() => {
    const fetchMinted = async () => {
      const minted = new Set<number>();
      const counts = { Legendary: 0, Rare: 0, Common: 0 };
      for (let id = 1; id <= MAX_NFTS; id++) {
        try {
          const owner = await useReadContract({
            address: NFT_ADDRESS,
            abi: NFT_ABI,
            functionName: 'ownerOf',
            args: [BigInt(id)],
          });
          if (owner.data) {
            minted.add(id);
            const rarity = getRarity(id);
            counts[rarity as keyof typeof counts]++;
          }
        } catch {
          // Not minted
        }
      }
      setMintedIds(minted);
      setTotals(counts);
    };
    fetchMinted();
  }, []);

  const handleMint = async (tokenId: number) => {
    if (!saleActive) {
      toast.error('Mint sale is currently inactive');
      return;
    }

    toast.promise(
      writeContractAsync({
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [BigInt(tokenId)],
        value: parseEther('0.01'), // ← Change this if you use tokenPrice(tokenId)
      }),
      {
        loading: `Minting NFT #${tokenId}...`,
        success: (hash) => (
          <div>
            <span>Minted successfully!</span>
            <br />
            <a
              href={`https://polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-cyan-400"
            >
              View on PolygonScan
            </a>
          </div>
        ),
        error: (err) => {
          const message = err.message?.includes('User rejected')
            ? 'You rejected the transaction'
            : err.message || 'Mint failed';
          return `Error: ${message}`;
        },
      }
    );
  };

  const filteredNFTs = Array.from({ length: MAX_NFTS }, (_, i) => i + 1)
    .filter(id => getRarity(id) === activeTab)
    .filter(id => {
      if (filter === 'Minted') return mintedIds.has(id);
      if (filter === 'Unminted') return !mintedIds.has(id);
      return true;
    })
    .slice(0, visibleCount);

  const loadMore = () => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, MAX_NFTS));

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">Fluxon NFT Marketplace</h1>
          <ConnectButton />
        </div>

        <div className="text-center mb-8">
          <p className={`text-2xl font-bold ${saleActive ? 'text-green-400' : 'text-red-400'}`}>
            Sale Status: {saleActive ? 'ACTIVE' : 'INACTIVE'}
          </p>
          <p className="text-xl mt-4">
            Legendary: {totals.Legendary}/50 | Rare: {totals.Rare}/150 | Common: {totals.Common}/300
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(['Legendary', 'Rare', 'Common'] as const).map((rarity) => (
            <button
              key={rarity}
              onClick={() => { setActiveTab(rarity); setVisibleCount(PAGE_SIZE); }}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                activeTab === rarity
                  ? `bg-gradient-to-r ${rarityColors[rarity]} text-black shadow-lg`
                  : 'bg-gray-800 text-cyan-400 border border-cyan-400 hover:bg-gray-700'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12">
          {(['All', 'Minted', 'Unminted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setVisibleCount(PAGE_SIZE); }}
              className={`px-6 py-2 rounded font-medium transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-cyan-400 border border-cyan-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          {filteredNFTs.map((tokenId) => {
            const isMinted = mintedIds.has(tokenId);
            return (
              <div
                key={tokenId}
                className={`relative rounded-xl overflow-hidden border-4 ${rarityBorder[activeTab]} shadow-lg hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded text-sm font-bold">
                  {activeTab}
                </div>
                <img
                  src={getImageUrl(tokenId)}
                  alt={`Fluxon NFT #${tokenId}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-800/90">
                  {isMinted ? (
                    <p className="text-green-400 text-center font-bold">Minted ✓</p>
                  ) : (
                    <button
                      onClick={() => handleMint(tokenId)}
                      disabled={!saleActive || isPending}
                      className={`w-full py-3 rounded font-bold transition-all ${
                        saleActive
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPending ? 'Minting...' : 'Mint Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < filteredNFTs.length + PAGE_SIZE && filteredNFTs.length > 0 && (
          <div className="text-center">
            <button
              onClick={loadMore}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-black hover:shadow-xl transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </main>
  );
}