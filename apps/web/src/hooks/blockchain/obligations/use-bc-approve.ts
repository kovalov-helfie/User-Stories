import { usePublicClient, useWriteContract } from 'wagmi'
import { parseUnits, Address } from 'viem'
import { DVD } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_ABI } from '../../../abis/token.abi'
import { MAX_AMOUNT } from '../../../constants'

export const useBcApprove = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            tokenAddress: string | undefined, 
            userAddress: string | undefined, 
            amount: number | undefined } ) => {
          if(!variables.tokenAddress || !variables.userAddress || !variables.amount) {
            throw new Error("No User")
          }
          try {
            const tokenDecimals = await publicClient?.readContract({
              abi: TOKEN_ABI,
              address: variables.tokenAddress as Address,
              functionName: 'decimals',
              args: [],
            })
            if(!tokenDecimals) {
              throw new Error("No Token decimals")
            }

            const wc = await writeContractAsync({
                abi: TOKEN_ABI,
                address: variables.tokenAddress as Address,
                functionName: 'approve',
                args: [
                    DVD,
                    parseUnits(variables.amount.toString(), tokenDecimals),
                ],
            })
            await publicClient?.waitForTransactionReceipt({hash: wc})
          } catch (error) {
            console.error(error)
            throw error
          }
        },
        onSuccess: () => {},
      })
    
    return mutation
}