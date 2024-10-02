import { createAppKit } from '@reown/appkit/react'
import { arbitrum, mainnet, sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { env } from './env'

const projectId = env.VITE_PROJECT_ID

const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

const networks = [ sepolia, mainnet, arbitrum,  ]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    allWallets: true,
    email: false,
    emailShowWallets: false,
    history: false,
    onramp: false,
    socials: false,
    swaps: false
  }
})
