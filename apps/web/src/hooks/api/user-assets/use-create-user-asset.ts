import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from '../../../env'
import { usePublicClient, useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useCreateUserAsset = () => {
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        senderAddress: string | undefined,
        userAddress: string | undefined,
        tokenAddress: string | undefined,
        obligationId: number | undefined,
      }) => {
        if (!variables.senderAddress || !variables.userAddress || !variables.tokenAddress || !variables.obligationId) {
          throw new Error("No User")
      }
      
      const hasUserAsset = await fetch(`${env.VITE_API_URL}/user-assets/has-user-asset/${variables.userAddress}-${variables.tokenAddress}`).then(res => res.json());
      console.log(hasUserAsset)
      console.log(variables.senderAddress)
      console.log(variables.userAddress)
      console.log(variables.tokenAddress)
      console.log(variables.obligationId)
      if(!hasUserAsset) {
        const addUserAssetSignature = await signMessageAsync({ message: verifyMessage(variables.senderAddress, 'addUserAsset') })
        const addAsset = await fetch(`${env.VITE_API_URL}/user-assets/add-user-asset`, {
          method: 'POST',
          body: JSON.stringify({
            tokenAddress: variables.tokenAddress,
            senderAddress: variables.senderAddress,
            userAddress: variables.userAddress,
            obligationId: variables.obligationId,
            signature: addUserAssetSignature
          },),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dvdTransfersUser'] })
    },
  })

  return mutation
}