import { usePublicClient, useSignMessage, useWriteContract } from 'wagmi'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../abis/identity.abi'
import { claimSignature } from '../../functions'
import { CLAIM_DATA, SCHEME } from '../../constants'

export const useBcCreateClaim = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        senderAddress: string | undefined,
        userAddress: string | undefined,
        identityAddress: string | undefined,
        claimTopic: bigint,
      }) => {
      if (!variables.senderAddress || !variables.userAddress || !variables.identityAddress) {
        throw new Error("No Sender")
      }

      try {
        const data = CLAIM_DATA
        const message = claimSignature(variables.userAddress as Address, variables.claimTopic, data)
        const signature = await signMessageAsync({ message: message })
        const uri = `${variables.claimTopic}-${variables.userAddress}`
        const wc = await writeContractAsync({
          abi: IDENTITY_ABI,
          address: variables.identityAddress as Address,
          functionName: 'addClaim',
          args: [
            variables.claimTopic,
            SCHEME,
            variables.identityAddress as Address,
            signature,
            data,
            uri,
          ],
        })
        await publicClient?.waitForTransactionReceipt({hash: wc})
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] })
    },
  })

  return mutation
}