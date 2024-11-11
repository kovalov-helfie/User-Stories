import { usePublicClient, useSignMessage, useWriteContract } from 'wagmi'
import { parseUnits, Address, formatUnits } from 'viem'
import { DVD } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DVD_ABI } from '../../../abis/dvd.abi'
import { TOKEN_ABI } from '../../../abis/token.abi'
import { generateTransferId, verifyMessage } from "../../../functions"
import { env } from '../../../env'

export const useBcInitDvdTransfers = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        obligationId: number,
        buyer: string | undefined,
        buyerToken: string | undefined,
        seller: string | undefined,
        sellerAmount: number | undefined,
        sellerToken: string | undefined,
        txCount: number | undefined,
      }) => {
      if (!variables.buyer || !variables.buyerToken || !variables.seller || !variables.sellerAmount || !variables.sellerToken || !variables.sellerAmount || !variables.txCount) {
        throw new Error("No User")
      }
      try {
        const sellerTokenDecimals = await publicClient?.readContract({
          abi: TOKEN_ABI,
          address: variables.sellerToken as Address,
          functionName: 'decimals',
          args: [],
        })
        if (!sellerTokenDecimals) {
          throw new Error("No Decimals")
        }
        const sellerAmount = parseUnits(variables.sellerAmount.toString(), sellerTokenDecimals)
        const buyerAmount = await publicClient?.readContract({
          abi: DVD_ABI,
          address: DVD,
          functionName: 'evaluateBuyerPrice',
          args: [
            variables.sellerToken as Address,
            sellerAmount
          ]
        })
        if (!buyerAmount) {
          throw new Error("No buyerAmount")
        }

        let currentSellerAmount = BigInt(0)
        let currentBuyerAmount = BigInt(0)
        for (let i = 0; i < variables.txCount; i++) {
          let sellerTxAmount = sellerAmount / BigInt(variables.txCount)
          let buyerTxAmount = buyerAmount / BigInt(variables.txCount)
          if (i === variables.txCount - 1) {
            sellerTxAmount = sellerAmount - currentSellerAmount;
            buyerTxAmount = buyerAmount - currentBuyerAmount;
          }

          const nonce = await publicClient?.readContract({
            abi: DVD_ABI,
            address: DVD,
            functionName: 'getTxNonce',
            args: [],
          })
          if (nonce === undefined) {
            throw new Error("No Nonce")
          }
          const transferId = generateTransferId(
            nonce,
            variables.buyer as Address,
            variables.buyerToken as Address,
            buyerTxAmount,
            variables.seller as Address,
            variables.sellerToken as Address,
            sellerTxAmount
          )
          
          console.warn(transferId)
          console.warn(formatUnits(buyerTxAmount, 6))
          console.warn(formatUnits(sellerTxAmount, sellerTokenDecimals))
          const addDVDTransferSignature = await signMessageAsync({ message: verifyMessage(variables.buyer, 'addDvdTransfer') })
          const addDVDTransfer = await fetch(`${env.VITE_API_URL}/dvd-transfers/add-dvd-transfer`, {
            method: 'POST',
            body: JSON.stringify({
              obligationId: variables.obligationId,
              nonce: Number(nonce),
              buyer: variables.buyer,
              buyerToken: variables.buyerToken,
              buyerAmount: Number(formatUnits(buyerTxAmount, 6)),
              seller: variables.seller,
              sellerToken: variables.sellerToken,
              sellerAmount: Number(formatUnits(sellerTxAmount, sellerTokenDecimals)),
              transferId: transferId,
              signature: addDVDTransferSignature,
            },),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res) => res.json())

          const wc = await writeContractAsync({
            abi: DVD_ABI,
            address: DVD,
            functionName: 'initiateDVDTransfer',
            args: [
              variables.buyerToken as Address,
              buyerTxAmount,
              variables.seller as Address,
              variables.sellerToken as Address,
              sellerTxAmount
            ],
          })
          await publicClient?.waitForTransactionReceipt({ hash: wc })

          currentSellerAmount += sellerTxAmount;
          currentBuyerAmount += buyerTxAmount;
        }
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