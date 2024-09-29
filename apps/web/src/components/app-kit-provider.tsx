import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiAdapter } from "../wagmi.config";
import { router } from "../lib/router";
import { RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

export function AppKitProvider() {
    return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
      </WagmiProvider>
    )
  }