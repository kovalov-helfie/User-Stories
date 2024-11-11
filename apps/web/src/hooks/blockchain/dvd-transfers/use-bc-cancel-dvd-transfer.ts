import { usePublicClient, useWriteContract } from 'wagmi'
import { Hex } from 'viem'
import { DVD } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DVD_ABI } from '../../../abis/dvd.abi'

export const useBcCancelDvdTransfer = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            transferId: string | undefined,
           } ) => {
          if(!variables.transferId) {
            throw new Error("No TransferId")
          }
          try {
            const wc = await writeContractAsync({
                abi: DVD_ABI,
                address: DVD,
                functionName: 'cancelDVDTransfer',
                args: [
                    variables.transferId as Hex
                ],
            })
            await publicClient?.waitForTransactionReceipt({hash: wc})    

          } catch (error) {
            console.error(error)
            throw error
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['dvdTransfersUser'] })
        },
      })
    
    return mutation
}