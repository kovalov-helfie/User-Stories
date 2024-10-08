import { usePublicClient, useWriteContract } from 'wagmi'
import { TOKEN_ABI } from '../../abis/token.abi'
import { parseUnits, Address } from 'viem'
import { TOKEN } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MINT_AMOUNT } from '../../constants'

export const useBcMintAsset = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            userAddress: string | undefined, 
            amount?: bigint } ) => {
          if(!variables.userAddress) {
            throw new Error("No User")
          }
    
          try {
            const wc = await writeContractAsync({
                abi: TOKEN_ABI,
                address: TOKEN,
                functionName: 'mint',
                args: [
                    variables.userAddress as Address,
                    parseUnits(MINT_AMOUNT, 18),
                    true
                ],
            })
            await publicClient?.waitForTransactionReceipt({hash: wc})
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