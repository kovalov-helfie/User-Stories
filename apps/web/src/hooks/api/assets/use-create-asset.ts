import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { usePublicClient, useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"
import { TOKEN_FACTORY_ABI } from '../../../abis/token-factory.abi'
import { TOKEN_FACTORY } from '../../../addresses'
import { Address, Hex } from 'viem'

export const useCreateAsset = () => {
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined,
        name: string | undefined,
        symbol: string | undefined,
        decimals: number | undefined,
      }) => {
        if (!variables.userAddress || !variables.name || !variables.symbol || !variables.decimals) {
          throw new Error("No User")
      }

      const tokenSalt = await publicClient?.readContract({
        abi: TOKEN_FACTORY_ABI,
        address: TOKEN_FACTORY,
        functionName: 'getTokenSalt',
        args: [
          variables.userAddress as Address, variables.name, variables.symbol, variables.decimals
        ]
      })
      const tokenAddress = await publicClient?.readContract({
        abi: TOKEN_FACTORY_ABI,
        address: TOKEN_FACTORY,
        functionName: 'getToken',
        args: [tokenSalt as Hex]
      })

      const addAssetSignature = await signMessageAsync({ message: verifyMessage(variables.userAddress, 'addAsset') })
      const addAsset = await fetch(`${env.VITE_API_URL}/assets/add-asset`, {
        method: 'POST',
        body: JSON.stringify({
          tokenAddress: tokenAddress,
          userAddress: variables.userAddress,
          name: variables.name,
          symbol: variables.symbol,
          decimals: variables.decimals,
          signature: addAssetSignature
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAssets'] })
    },
  })

  return mutation
}