import { usePublicClient, useSignMessage, useWriteContract } from 'wagmi'
import { Address, parseUnits, zeroAddress, Hex } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../../abis/identity.abi'
import { claimSignature, generateClaimId } from '../../../functions'

export const useBcRemoveClaim = (isToken?: boolean) => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        address: string | undefined,
        identityAddress: string | undefined,
        claimTopic: bigint,
      }) => {
      if (!variables.address || !variables.identityAddress) {
        throw new Error("No User")
      }

      try {
        const claimId = generateClaimId(variables.identityAddress as Address, variables.claimTopic)
        const wc = await writeContractAsync({
          abi: IDENTITY_ABI,
          address: variables.identityAddress as Address,
          functionName: 'removeClaim',
          args: [
            claimId as Hex
          ],
        })
        await publicClient?.waitForTransactionReceipt({hash: wc})
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      const query = isToken ? 'token-claims' : 'claims'
      queryClient.invalidateQueries({ queryKey: [query] })
    },
  })

  return mutation
}