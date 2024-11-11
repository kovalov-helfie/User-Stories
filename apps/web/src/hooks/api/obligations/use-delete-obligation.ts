import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useDeleteObligation = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        tokenAddress: string | undefined,
        userAddress: string | undefined, 
        obligationId: number | undefined } ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const deleteObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'deleteObligation')})
      const deleteObligation = await fetch(`${env.VITE_API_URL}/obligations/obligation/delete-obligation`, { 
        method: 'DELETE', 
        body: JSON.stringify({
            tokenAddress: variables.tokenAddress, 
            userAddress: variables.userAddress, 
            obligationId: variables.obligationId,
            signature: deleteObligationSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAssets'] })
    },
  })

  return mutation
}