import { useWriteContract } from 'wagmi'
import { parseUnits, Address } from 'viem'
import { UNI_TEST_TOKEN0, TOKEN, UNI_ROUTER } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UNI_ROUTER_ABI } from '../../abis/router.abi'
import { MAX_AMOUNT, MINT_AMOUNT } from '../../constants'

export const useBcSwap = () => {
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
          const path: Address[] = [UNI_TEST_TOKEN0, TOKEN]
          try {
            const wc = await writeContractAsync({
                abi: UNI_ROUTER_ABI,
                address: UNI_ROUTER,
                functionName: 'swapTokensForExactTokens',
                args: [
                    parseUnits(MINT_AMOUNT, 18),
                    parseUnits(MAX_AMOUNT, 6),
                    path,
                    variables.userAddress as Address,
                    BigInt(0)
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