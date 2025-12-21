import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';
import { http } from 'wagmi';
import { createConfig } from 'wagmi';

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
});
