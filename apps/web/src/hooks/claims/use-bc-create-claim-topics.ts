import { useSignMessage, useWriteContract } from 'wagmi'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../abis/identity.abi'
import { claimSignature } from '../../functions'

const SCHEME = BigInt('1')

// TODO: 1. claimTopics in bc, change dp with user country; 2. video; 3. Deployment
export const useBcCreateClaim = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        senderAddress: string | undefined,
        userAddress: string | undefined,
        identityAddress: string | undefined,
        claimTopic: bigint,
      }) => {
      if (!variables.senderAddress) {
        throw new Error("No Sender")
      } else if (!variables.userAddress) {
        throw new Error("No User")
      } else if (!variables.identityAddress) {
        throw new Error("No Identity")
      }

      try {
        const data = zeroAddress
        const message = claimSignature(variables.userAddress as `0x${string}`, variables.claimTopic, data)
        const signature = await signMessageAsync({ message: message })
        const uri = `${variables.claimTopic}-${variables.userAddress}`
        const wc = await writeContractAsync({
          abi: IDENTITY_ABI,
          address: variables.identityAddress as Address,
          functionName: 'addClaim',
          args: [
            variables.claimTopic,
            SCHEME,
            variables.userAddress as Address,
            signature,
            data,
            uri,
          ],
        })
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClaims'] })
    },
  })

  return mutation
}