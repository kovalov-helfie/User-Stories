import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from "../../../env"
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useVerifyAsset = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        senderAddress: string | undefined,
        tokenAddress: string | undefined, 
        verify: boolean,
        country: number | undefined} ) => {
      if(!variables.senderAddress) {
        throw new Error("No User")
      }
      
      const verifySignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'verifyAsset')})
      const verifyAsset = await fetch(`${env.VITE_API_URL}/assets/verify-asset`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            senderAddress: variables.senderAddress, 
            tokenAddress: variables.tokenAddress,
            verify: variables.verify,
            country: variables.country,
            signature: verifySignature},),
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