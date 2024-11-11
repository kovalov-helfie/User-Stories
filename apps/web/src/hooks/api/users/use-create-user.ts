import { useMutation, useQueryClient } from '@tanstack/react-query'
import { env } from "../../../env"
import { useSignMessage } from 'wagmi'
import { verifyMessage } from "../../../functions"

export const useCreateUser = () => { 
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined } ) => {
      if(!variables.userAddress) {
        throw new Error("No User")
      }

      const addUserSignature = await signMessageAsync({message: verifyMessage(variables.userAddress, 'createUser')})
      const addUser = await fetch(`${env.VITE_API_URL}/users/add-user`, { 
        method: 'POST', 
        body: JSON.stringify({
            userAddress: variables.userAddress, 
            signature: addUserSignature,},),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return mutation
}