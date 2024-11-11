import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useCreateTokenClaim = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        senderAddress: string | undefined, 
        tokenAddress: string | undefined, 
        claimTopic: string | undefined,
        docgen: File | null} ) => {
      if(!variables.senderAddress) {
        throw new Error("No User")
      }

      const claimSignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'createTokenClaim')})
      const addClaim = await fetch(`${env.VITE_API_URL}/token-claims/add-claim`, { 
        method: 'POST', 
        body: JSON.stringify({
          senderAddress: variables.senderAddress,
          tokenAddress: variables.tokenAddress, 
          claimTopic: Number(variables.claimTopic), 
          signature: claimSignature
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const formData = new FormData()
      if(!variables.docgen) {
        throw new Error("No File")
      }
      formData.append('file', variables.docgen)
      
      const updateDocgenSignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'updateTokenDocgen')})
      const putFile = fetch(`${env.VITE_API_URL}/token-claims/claim/update-docgen/${variables.senderAddress}-${variables.tokenAddress}-${variables.claimTopic}`, { 
        method: 'PATCH', 
        body: formData,
        headers: {
          'signature': updateDocgenSignature
        } 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenClaims'] })
    },
  })

  return mutation
}