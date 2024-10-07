import { useWriteContract } from 'wagmi'
import { IR } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IR_ABI } from '../../abis/ir.abi'

export const useDeleteIdentity = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined
            }) => {
            if (!variables.userAddress) {
                throw new Error("No User")
            }

            try {
                const wc = await writeContractAsync({
                    abi: IR_ABI,
                    address: IR,
                    functionName: 'deleteIdentity',
                    args: [
                        variables.userAddress
                    ],
                })
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    return mutation
}