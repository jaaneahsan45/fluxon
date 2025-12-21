'use client';

import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useChainId, 
  useConnection
} from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { ShieldAlert, Coins, Layers, Wallet, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Contract Addresses
const STAKING_CONTRACT = process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`;
const FLX_TOKEN = process.env.NEXT_PUBLIC_FLX_TOKEN as `0x${string}`;

const FLX_ABI = [
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;

const STAKING_ABI = [
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"boost","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;

export default function StakingClient() {
  const { address } = useConnection();
  const chainId = useChainId();
  const [amount, setAmount] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { writeContractAsync, isPending } = useWriteContract();

  // --- READ DATA ---
  const { data: totalPoolStaked, refetch: refetchPool } = useReadContract({
    address: FLX_TOKEN,
    abi: FLX_ABI,
    functionName: 'balanceOf',
    args: [STAKING_CONTRACT],
    query: { refetchInterval: 5000 }
  });

  const { data: userBalance, refetch: refetchUserBal } = useReadContract({
    address: FLX_TOKEN, abi: FLX_ABI, functionName: 'balanceOf', args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: FLX_TOKEN, abi: FLX_ABI, functionName: 'allowance', args: address ? [address, STAKING_CONTRACT] : undefined,
  });

  const { data: userData, refetch: refetchUserStats } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'userInfo', args: address ? [address] : undefined,
  });

  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'pendingRewards', args: address ? [address] : undefined,
  });

  // --- LOGIC ---
  const isUiPaused = totalPoolStaked === 0n;
  const userStakedAmount = userData ? userData[0] : 0n;
  const isApproved = allowance !== undefined && amount ? allowance >= parseEther(amount) : false;
  const displayBalance = userBalance ? formatEther(userBalance) : '0';

  const refreshAll = () => {
    refetchUserBal(); refetchAllowance(); refetchUserStats(); 
    refetchRewards(); refetchPool();
  };

  // --- ACTIONS ---
  const handleStakeAction = async () => {
    if (!address || !amount || isUiPaused) return;
    
    const config = isApproved 
      ? { address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'stake' as const, args: [parseEther(amount)] as const }
      : { address: FLX_TOKEN, abi: FLX_ABI, functionName: 'approve' as const, args: [STAKING_CONTRACT, parseEther(amount)] as const };

    toast.promise(
      writeContractAsync({ ...config, chainId }),
      { 
        loading: isApproved ? 'Executing Stake...' : 'Approving FLX...', 
        success: isApproved ? 'Staked Successfully!' : 'Approved! Now you can stake.', 
        error: (e: any) => e.shortMessage || 'Transaction Failed' 
      }
    ).then(() => { refreshAll(); if (isApproved) setAmount(''); });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020202]">
      <div className="w-full max-w-5xl bg-[#0a0a0a] text-white rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* CIRCUIT BREAKER BANNER */}
        {isUiPaused && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 text-center">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldAlert size={16} /> Reward Pool Empty: Staking Paused
            </span>
          </div>
        )}

        <div className="p-8 md:p-12 flex justify-between items-center border-b border-white/5">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-gray-600 bg-clip-text text-transparent italic">FLUXON</h1>
          <ConnectButton />
        </div>

        <div className="p-8 md:p-12 space-y-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-600/5 p-8 rounded-[2rem] border border-blue-500/20">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Layers size={14} /> Total Pool</p>
              <p className="text-4xl font-mono font-bold mt-2 tracking-tighter">
                {totalPoolStaked ? Number(formatEther(totalPoolStaked)).toLocaleString() : '0'} <span className="text-blue-500 text-sm">FLX</span>
              </p>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Wallet size={14} /> Your Stake</p>
              <p className="text-4xl font-mono font-bold mt-2 tracking-tighter">
                {formatEther(userStakedAmount)} <span className="text-blue-500 text-sm">FLX</span>
              </p>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 text-green-400">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Coins size={14} /> Rewards</p>
              <p className="text-4xl font-mono font-bold mt-2 tracking-tighter">
                {pendingRewards ? formatEther(pendingRewards) : '0.00'}
              </p>
            </div>
          </div>

          {/* INTERACTION AREA */}
          <div className={`p-10 rounded-[3rem] border transition-all duration-500 ${isUiPaused ? 'bg-amber-500/[0.02] border-amber-500/10 grayscale' : 'bg-white/[0.03] border-white/5'}`}>
            <div className="flex justify-between items-end mb-6 px-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Stake Tokens</label>
              <button disabled={isUiPaused} onClick={() => setAmount(displayBalance)} className="text-xs font-bold text-blue-400 hover:text-blue-300 disabled:text-gray-700">
                Wallet: {Number(displayBalance).toFixed(2)} FLX
              </button>
            </div>

            <div className="relative">
              <input 
                type="number" disabled={isUiPaused} value={amount} onChange={(e) => setAmount(e.target.value)} 
                placeholder={isUiPaused ? "REFILL REQUIRED" : "0.00"}
                className={`w-full bg-black/40 p-10 rounded-3xl text-5xl outline-none border transition-all font-mono ${isUiPaused ? 'border-amber-500/10' : 'border-white/5 focus:border-blue-500/50'}`}
              />
              {!isUiPaused && (
                <button onClick={() => setAmount(displayBalance)} className="absolute right-8 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl text-xs font-black shadow-xl">MAX</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* THE STAKE / APPROVE BUTTON */}
              <button 
                onClick={handleStakeAction} 
                disabled={isPending || !amount || isUiPaused} 
                className={`py-8 rounded-3xl font-black text-2xl tracking-tighter transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 ${isUiPaused ? 'bg-gray-900 text-gray-600' : isApproved ? 'bg-green-600 shadow-xl shadow-green-600/20' : 'bg-blue-600 shadow-xl shadow-blue-600/20'}`}
              >
                {isPending ? 'PROCESSING...' : isUiPaused ? 'POOL EMPTY' : isApproved ? (
                  <><ArrowUpCircle size={24} /> STAKE FLX</>
                ) : 'APPROVE FLX'}
              </button>
              
              <button 
                onClick={() => writeContractAsync({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'unstake', args: [parseEther(amount)], chainId }).then(() => refreshAll())}
                disabled={isPending || userStakedAmount === 0n || !amount}
                className="bg-white/5 hover:bg-white/10 border border-white/5 py-8 rounded-3xl font-bold text-xl transition-all disabled:opacity-10"
              >
                UNSTAKE
              </button>
            </div>

            <button 
              onClick={() => writeContractAsync({ address: STAKING_CONTRACT, abi: STAKING_ABI, functionName: 'claimRewards', chainId }).then(() => refreshAll())}
              disabled={!pendingRewards || pendingRewards === 0n}
              className="w-full mt-4 bg-white/5 hover:bg-indigo-600/20 py-8 rounded-3xl font-black text-2xl tracking-tighter border border-white/5 transition-all disabled:opacity-10"
            >
              CLAIM REWARDS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}