import { usePublicClient, useWriteContract } from 'wagmi'
import { parseUnits, Address } from 'viem'
import { DVD } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_ABI } from '../../../abis/token.abi'
import { MAX_AMOUNT } from '../../../constants'
import { DVD_ABI } from '../../../abis/dvd.abi'

export const useBcBuyerApprove = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            userAddress: string | undefined, 
            buyerToken: string | undefined, 
            sellerAmount: number | undefined 
            sellerToken: string | undefined } ) => {
          if(!variables.userAddress || !variables.buyerToken || !variables.sellerAmount || !variables.sellerToken) {
            throw new Error("No User")
          }
          try {
            const sellerTokenDecimals = await publicClient?.readContract({
                abi: TOKEN_ABI,
                address: variables.sellerToken as Address,
                functionName: 'decimals',
                args: [],
            })
            if(!sellerTokenDecimals) {
              throw new Error("No Token decimals")
            }
            const buyerAmount = await publicClient?.readContract({
                abi: DVD_ABI,
                address: DVD,
                functionName: 'evaluateBuyerPrice',
                args: [
                    variables.sellerToken as Address,
                    parseUnits(variables.sellerAmount.toString(), sellerTokenDecimals)
                ]
            })
            if(!buyerAmount) {
                throw new Error("No Buyer Amount")
            }

            const wc = await writeContractAsync({
                abi: TOKEN_ABI,
                address: variables.buyerToken as Address,
                functionName: 'approve',
                args: [
                    DVD,
                    buyerAmount,
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