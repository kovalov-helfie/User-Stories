import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from "../../../env"
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useUpdateObligation = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined,
        obligationId: number | undefined } ) => { 
      if(!variables.userAddress) {
        throw new Error("No User")
      }
      const updateObligationSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'updateObligation')})
      const updateObligation = await fetch(`${env.VITE_API_URL}/obligations/obligation/update-obligation`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            userAddress: variables.userAddress,
            obligationId: variables.obligationId,
            signature: updateObligationSignature,
        },),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obligations'] })
    },
  })

  return mutation
}