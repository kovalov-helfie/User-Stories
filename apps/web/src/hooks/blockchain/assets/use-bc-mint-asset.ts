import { usePublicClient, useWriteContract } from 'wagmi'
import { TOKEN_ABI } from '../../../abis/token.abi'
import { parseUnits, Address } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MINT_AMOUNT } from '../../../constants'

export const useBcMintAsset = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        tokenAddress: string | undefined,
        userAddress: string | undefined,
        amount?: bigint
      }) => {
      if (!variables.userAddress || !variables.tokenAddress) {
        throw new Error("No User")
      }

      try {
        const tokenDecimals = await publicClient?.readContract({
          abi: TOKEN_ABI,
          address: variables.tokenAddress as Address,
          functionName: 'decimals',
          args: [],
        })

        const parsedAmount = parseUnits(variables.amount?.toString() ?? MINT_AMOUNT, tokenDecimals ?? 18);

        const wc = await writeContractAsync({
          abi: TOKEN_ABI,
          address: variables.tokenAddress as Address,
          functionName: 'mint',
          args: [
            variables.userAddress as Address,
            parsedAmount,
            true
          ],
        })
        await publicClient?.waitForTransactionReceipt({ hash: wc })
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAssets'] })
    },
  })

  return mutation
}