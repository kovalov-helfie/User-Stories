import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../functions"

export const useCreateObligation = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        assetId: number | undefined,
        userAddress: string | undefined, 
        minPurchaseAmount: number | undefined, 
        lockupPeriod: number | undefined, 
        transferRestrictionAddress: string | undefined, } ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const addObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'addObligation')})
      const addObligation = await fetch(`${env.VITE_API_URL}/obligations/add-obligation`, { 
        method: 'POST', 
        body: JSON.stringify({
            assetId: variables.assetId, 
            userAddress: variables.userAddress, 
            minPurchaseAmount: variables.minPurchaseAmount, 
            lockupPeriod: variables.lockupPeriod, 
            transferRestrictionAddress: variables.transferRestrictionAddress,
            signature: addObligationSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
      
      const updateObligationAssetSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'updateAssetObligation')})
      const updateObligationAsset = await fetch(`${env.VITE_API_URL}/assets/asset/add-obligation`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            assetId: variables.assetId, 
            userAddress: variables.userAddress, 
            obligationId: addObligation.id,
            signature: updateObligationAssetSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obligation'] })
    },
  })

  return mutation
}