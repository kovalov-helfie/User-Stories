import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useCreateObligation = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        tokenAddress: string | undefined,
        userAddress: string | undefined, 
        amount: number | undefined, 
        txCount: number | undefined,
        obligationId: number | undefined} ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      if(variables.obligationId === null) { 
        const addObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'addObligation')})
        const addObligation = await fetch(`${env.VITE_API_URL}/obligations/add-obligation`, { 
          method: 'POST', 
          body: JSON.stringify({
              tokenAddress: variables.tokenAddress, 
              userAddress: variables.userAddress, 
              amount: variables.amount, 
              txCount: variables.txCount,
              signature: addObligationSignature,},),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
      } else {
        const updateObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'editObligation')})
        const updateObligation = await fetch(`${env.VITE_API_URL}/obligations/obligation/edit-obligation`, { 
          method: 'PATCH', 
          body: JSON.stringify({
              userAddress: variables.userAddress, 
              obligationId: variables.obligationId,
              amount: variables.amount, 
              txCount: variables.txCount,
              signature: updateObligationSignature,},),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json())
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obligation'] })
      queryClient.invalidateQueries({ queryKey: ['userAssets'] })
    },
  })

  return mutation
}