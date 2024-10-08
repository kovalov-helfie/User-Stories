import { usePublicClient, useWriteContract } from 'wagmi'
import { IR } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IR_ABI } from '../../abis/ir.abi'
import { Address } from 'viem'

export const useRegisterIdentity = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
                identityAddress: string | undefined,
                country: number,
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
                        variables.userAddress as Address,
                        variables.identityAddress  as Address,
                        variables.country,
                    ],
                })
                await publicClient?.waitForTransactionReceipt({hash: wc})
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