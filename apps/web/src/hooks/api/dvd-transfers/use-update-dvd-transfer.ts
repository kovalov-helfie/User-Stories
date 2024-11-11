import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useUpdateDvdTransfer = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: { 
        userAddress: string | undefined,
        dvdTransferId: number | undefined,
        verify: boolean} ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }
      
      const verifySignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'updateDvdTransfer')})
      const putFile = fetch(`${env.VITE_API_URL}/dvd-transfers/update-dvd-transfer`, { 
        method: 'PATCH', 
        body: JSON.stringify({
            userAddress: variables.userAddress, 
            dvdTransferId: variables.dvdTransferId, 
            verify: variables.verify,
            signature: verifySignature},),
        headers: {
          'Content-Type': 'application/json'
        } 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dvdTransfers'] })
    },
  })

  return mutation
}