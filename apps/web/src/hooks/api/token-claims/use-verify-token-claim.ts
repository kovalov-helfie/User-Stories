import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useVerifyTokenClaim = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        senderAddress: string | undefined,
        tokenAddress: string | undefined, 
        claimTopic: number | undefined,
        verify: boolean} ) => {
      if(!variables.senderAddress) {
        throw new Error("No User")
      }
      
      const verifySignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'verifyTokenClaim')})
      const putFile = fetch(`${env.VITE_API_URL}/token-claims/verify-token-claim`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            senderAddress: variables.senderAddress, 
            tokenAddress: variables.tokenAddress, 
            claimTopic: Number(variables.claimTopic), 
            verify: variables.verify,
            signature: verifySignature},),
        headers: {
          'Content-Type': 'application/json'
        } 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenClaims'] })
    },
  })

  return mutation
}