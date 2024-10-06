import { useWriteContract } from 'wagmi'
import { TOKEN_ABI } from '../../abis/token.abi'
import { parseUnits } from 'viem'
import { TOKEN } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const MINT_AMOUNT = '100'

export const useBcMintAsset = () => {
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
    
          try {
            const wc = await writeContractAsync({
                abi: TOKEN_ABI,
                address: TOKEN,
                functionName: 'mint',
                args: [
                    variables.userAddress,
                    parseUnits(MINT_AMOUNT, 18),
                    true
                ],
            })
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