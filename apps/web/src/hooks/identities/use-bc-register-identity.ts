import { useWriteContract } from 'wagmi'
import { IR } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IR_ABI } from '../../abis/ir.abi'

export const useRegisterIdentity = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
                identityAddress: string | undefined,
                country: bigint,
            }) => {
            if (!variables.userAddress) {
                throw new Error("No User")
            } else if (!variables.identityAddress) {
                throw new Error("No Identity")
            }

            try {
                const wc = await writeContractAsync({
                    abi: IR_ABI,
                    address: IR,
                    functionName: 'registerIdentity',
                    args: [
                        variables.userAddress,
                        variables.identityAddress,
                        variables.country,
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