import { useSignMessage, useWriteContract } from 'wagmi'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../abis/identity.abi'
import { claimSignature, generateClaimId } from '../../functions'

const SCHEME = BigInt('1')

// TODO: 1. claimTopics in bc, change dp with user country; 2. video; 3. Deployment
export const useBcRemoveClaim = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined,
        identityAddress: string | undefined,
        claimTopic: bigint,
      }) => {
      if (!variables.userAddress) {
        throw new Error("No User")
      } else if (!variables.identityAddress) {
        throw new Error("No Identity")
      }

      try {
        const claimId = generateClaimId(variables.userAddress as `0x${string}`, variables.claimTopic)
        const wc = await writeContractAsync({
          abi: IDENTITY_ABI,
          address: variables.identityAddress as Address,
          functionName: 'removeClaim',
          args: [
            claimId
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