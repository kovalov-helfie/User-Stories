import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useEditTokenClaim = () => { 
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

      const formData = new FormData()
      if(!variables.docgen) {
        throw new Error("No File")
      }
      formData.append('file', variables.docgen)
      
      const updateDocgenSignature = await signMessageAsync({message: verifyMessage(variables.senderAddress, 'updateDocgen')})
      const putFile = fetch(`${env.VITE_API_URL}/token-claims/claim/update-docgen/${variables.tokenAddress}-${variables.claimTopic}`, { 
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