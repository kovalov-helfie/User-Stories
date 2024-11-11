import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useCreateUserClaim = () => { 
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

      const claimSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'createClaim')})
      const addClaim = await fetch(`${env.VITE_API_URL}/claims/add-claim`, { 
        method: 'POST', 
        body: JSON.stringify({userAddress: variables.userAddress, claimTopic: Number(variables.claimTopic), signature: claimSignature},),
        headers: {
          'Content-Type': 'application/json'
        }
      })
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