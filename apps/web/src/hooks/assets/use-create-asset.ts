import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../functions"

export const useCreateAsset = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        userAddress: string | undefined, 
        name: string | undefined, 
        description: string | undefined, 
        type: string | undefined, } ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const addAssetSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'addAsset')})
      const addAsset = await fetch(`${env.VITE_API_URL}/assets/add-asset`, { 
        method: 'POST', 
        body: JSON.stringify({
            userAddress: variables.userAddress, 
            name: variables.name, 
            description: variables.description, 
            type: variables.type, 
            signature: addAssetSignature},),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAssets'] })
    },
  })

  return mutation
}