import { usePublicClient, useWriteContract } from 'wagmi'
import { Hex } from 'viem'
import { DVD } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DVD_ABI } from '../../../abis/dvd.abi'

export const useBcTakeDvdTransfer = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
          variables: { 
            transferId: string | undefined} ) => {
          if(!variables.transferId) {
            throw new Error("No Transfer")
          }
          try {
            // const buyerTokenDecimals = await publicClient?.readContract({
            //     abi: TOKEN_ABI,
            //     address: variables.buyerToken as Address,
            //     functionName: 'decimals',
            //     args: [],
            // })

            // const sellerTokenDecimals = await publicClient?.readContract({
            //     abi: TOKEN_ABI,
            //     address: variables.sellerToken as Address,
            //     functionName: 'decimals',
            //     args: [],
            // })
            // if(!buyerTokenDecimals || !sellerTokenDecimals) {
            //     throw new Error("No Decimals")
            // }

            // const buyerTxAmount = parseUnits(variables.buyerAmount.toString(), buyerTokenDecimals)
            // const sellerTxAmount = parseUnits(variables.sellerAmount.toString(), sellerTokenDecimals)
            // const transferId = await publicClient?.readContract({
            //   abi: DVD_ABI,
            //   address: DVD,
            //   functionName: 'calculateTransferID',
            //   args: [
            //       variables.nonce,
            //       variables.buyer as Address,
            //       variables.buyerToken as Address,
            //       buyerTxAmount,
            //       variables.seller as Address,
            //       variables.sellerToken as Address,
            //       sellerTxAmount
            //   ],
            // })

            const wc = await writeContractAsync({
                abi: DVD_ABI,
                address: DVD,
                functionName: 'takeDVDTransfer',
                args: [
                  variables.transferId as Hex,
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