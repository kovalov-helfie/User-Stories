import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { usePublicClient, useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"
import { ID_FACTORY_ABI } from '../../../abis/identity-factory.abi'
import { IDENTITY_FACTORY } from '../../../addresses'
import { Address } from 'viem'

export const useCreateIdentity = () => {
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined,
        senderAddress: string | undefined,
      }) => {
      if (!variables.userAddress || !variables.senderAddress || !publicClient) {
        throw new Error("No User")
      }

      const identityAddress = await publicClient.readContract({
        abi: ID_FACTORY_ABI,
        address: IDENTITY_FACTORY,
        functionName: 'getIdentity',
        args: [variables.userAddress as Address],
      })

      const addIdentitySignature = await signMessageAsync({ message: verifyMessage(variables.senderAddress, 'createIdentity') })
      const addIdentity = await fetch(`${env.VITE_API_URL}/identities/add-identity`, {
        method: 'POST',
        body: JSON.stringify({
          identityAddress: identityAddress,
          senderAddress: variables.senderAddress,
          signature: addIdentitySignature,
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())

      const updateIdentityUserSignature = await signMessageAsync({ message: verifyMessage(variables.senderAddress, 'userSetIdentity') })
      const updateIdentityUser = await fetch(`${env.VITE_API_URL}/users/set-identity`, {
        method: 'PATCH',
        body: JSON.stringify({
          senderAddress: variables.senderAddress,
          userAddress: variables.userAddress,
          identityAddress: identityAddress,
          signature: updateIdentityUserSignature,
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return mutation
}