import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { usePublicClient, useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"
import { ID_FACTORY_ABI } from '../../../abis/identity-factory.abi'
import { IDENTITY_FACTORY } from '../../../addresses'
import { Address } from 'viem'

export const useCreateTokenIdentity = () => {
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        tokenAddress: string | undefined,
        senderAddress: string | undefined,
      }) => {
      if (!variables.tokenAddress || !variables.senderAddress || !publicClient) {
        throw new Error("No Token")
      }

      const identityAddress = await publicClient.readContract({
        abi: ID_FACTORY_ABI,
        address: IDENTITY_FACTORY,
        functionName: 'getIdentity',
        args: [variables.tokenAddress as Address],
      })

      const addIdentitySignature = await signMessageAsync({ message: verifyMessage(variables.senderAddress, 'createTokenIdentity') })
      const addIdentity = await fetch(`${env.VITE_API_URL}/token-identities/add-token-identity`, {
        method: 'POST',
        body: JSON.stringify({
          tokenAddress: variables.tokenAddress,
          identityAddress: identityAddress,
          senderAddress: variables.senderAddress,
          signature: addIdentitySignature,
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())

      const updateIdentitySignature = await signMessageAsync({ message: verifyMessage(variables.senderAddress, 'userSetTokenIdentity') })
      const updateIdentity = await fetch(`${env.VITE_API_URL}/assets/set-asset-identity`, {
        method: 'PATCH',
        body: JSON.stringify({
          senderAddress: variables.senderAddress,
          tokenAddress: variables.tokenAddress,
          identityAddress: identityAddress,
          signature: updateIdentitySignature,
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  return mutation
}