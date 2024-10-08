import { useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'
import { TEST_USDT, TOKEN, UNI_TEST_TOKEN0 } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_ABI } from '../../abis/token.abi'

const MAX_AMOUNT = '100000'

export const useBcApprove = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            userAddress: string | undefined, 
            amount?: bigint } ) => {
          if(!variables.userAddress) {
            throw new Error("No User")
          }
          const path = [TEST_USDT, TOKEN]
          try {
            const wc = await writeContractAsync({
                abi: TOKEN_ABI,
                address: UNI_TEST_TOKEN0,
                functionName: 'approve',
                args: [
                    variables.userAddress,
                    parseUnits(MAX_AMOUNT, 6),
                ],
            })
          } catch (error) {
            console.error(error)
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['obligations'] })
        },
      })
    
    return mutation
}