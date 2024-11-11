import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useVerifyTokenComplianceRequest = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        senderAddress: string | undefined,
        tokenAddress: string | undefined,
        userAddress: string | undefined,
        verify: boolean} ) => {
      if(!variables.senderAddress || !variables.tokenAddress || !variables.userAddress) {
        throw new Error("No User")
      }
      
      const verifySignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'verifyTokenComplianceRequest')})
      const putFile = fetch(`${env.VITE_API_URL}/token-compliance-requests/verify-token-compliance-request`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            senderAddress: variables.senderAddress, 
            tokenAddress: variables.tokenAddress, 
            userAddress: variables.userAddress, 
            verify: variables.verify,
            signature: verifySignature},),
        headers: {
          'Content-Type': 'application/json'
        } 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenComplianceRequestsAdmin'] })
    },
  })

  return mutation
}