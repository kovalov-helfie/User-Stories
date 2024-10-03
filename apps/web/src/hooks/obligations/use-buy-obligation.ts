import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../functions"

export const useBuyObligation = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        assetId: number | undefined,
        userAddress: string | undefined, 
        minPurchaseAmount: number | undefined, 
        obligationId: number | undefined } ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const buyObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'buyObligation')})
      const buyObligation = await fetch(`${env.VITE_API_URL}/obligations/obligation/buy-obligation`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            assetId: variables.assetId, 
            userAddress: variables.userAddress,
            obligationId: variables.obligationId,
            signature: buyObligationSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
      
      const updateAssetUserSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'updateUserAsset')})
      const updateAssetUser = await fetch(`${env.VITE_API_URL}/assets/asset/update-user`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            assetId: variables.assetId, 
            userAddress: variables.userAddress,
            signature: updateAssetUserSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obligations'] })
    },
  })

  return mutation
}