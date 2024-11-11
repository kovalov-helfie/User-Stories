import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useEditUserClaim = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        userAddress: string | undefined, 
        claimTopic: string | undefined,
        docgen: File | null} ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const formData = new FormData()
      if(!variables.docgen) {
        throw new Error("No File")
      }
      formData.append('file', variables.docgen)
      
      const updateDocgenSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'updateDocgen')})
      const putFile = fetch(`${env.VITE_API_URL}/claims/claim/update-docgen/${variables.userAddress}-${variables.claimTopic}`, { 
        method: 'PATCH', 
        body: formData,
        headers: {
          'signature': updateDocgenSignature
        } 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClaims'] })
    },
  })

  return mutation
}