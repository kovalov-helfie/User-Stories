import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../functions"
import { useGetUserIdentity } from './use-bc-get-identity'

export const useCreateIdentity = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        senderAddress: string | undefined,
        userAddress: string | undefined } ) => {
      if(!variables.userAddress || !variables.senderAddress) {
        throw new Error("No User")
      }

      const identityAddress = useGetUserIdentity(variables.userAddress)

      const addIdentitySignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'createIdentity')})
      const addIdentity = await fetch(`${env.VITE_API_URL}/identities/add-identity`, { 
        method: 'POST', 
        body: JSON.stringify({
            identityAddress: identityAddress, 
            senderAddress: variables.senderAddress, 
            signature: addIdentitySignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
      
      const updateIdentityUserSignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'userSetIdentity')})
      const updateIdentityUser = await fetch(`${env.VITE_API_URL}/users/set-identity`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            senderAddress: variables.senderAddress, 
            userAddress: variables.userAddress, 
            identityAddress: identityAddress, 
            signature: updateIdentityUserSignature,},),
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