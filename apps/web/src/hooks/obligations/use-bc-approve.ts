import { usePublicClient, useWriteContract } from 'wagmi'
import { parseUnits, Address } from 'viem'
import { UNI_ROUTER, UNI_TEST_TOKEN0 } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_ABI } from '../../abis/token.abi'
import { MAX_AMOUNT } from '../../constants'

export const useBcApprove = () => {
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
                address: UNI_TEST_TOKEN0,
                functionName: 'approve',
                args: [
                    UNI_ROUTER,
                    parseUnits(MAX_AMOUNT, 6),
                ],
            })
            await publicClient?.waitForTransactionReceipt({hash: wc})
          } catch (error) {
            console.error(error)
            throw error
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['obligations'] })
        },
      })
    
    return mutation
}