import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from "../../../env"
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useVerifyUser = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        senderAddress: string | undefined,
        userAddress: string | undefined, 
        verify: boolean,
        country: number | undefined} ) => {
      if(!variables.senderAddress) {
        throw new Error("No User")
      }
      
      const verifySignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'verifyUser')})
      const verifyUser = await fetch(`${env.VITE_API_URL}/users/verify-user`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            senderAddress: variables.senderAddress, 
            userAddress: variables.userAddress,
            verify: variables.verify,
            country: variables.country,
            signature: verifySignature},),
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