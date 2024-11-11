import { usePublicClient, useWriteContract } from 'wagmi'
import { IR } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IR_ABI } from '../../../abis/ir.abi'
import { Address } from 'viem'

export const useDeleteIdentity = (isToken?: boolean) => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                address: string | undefined
            }) => {
            if (!variables.address) {
                throw new Error("No User")
            }

            try {
                const wc = await writeContractAsync({
                    abi: IR_ABI,
                    address: IR,
                    functionName: 'deleteIdentity',
                    args: [
                        variables.address as Address
                    ],
                })
                await publicClient?.waitForTransactionReceipt({hash: wc})
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: () => {
            const query = isToken ? 'assets' : 'users';
            queryClient.invalidateQueries({ queryKey: [query] })
        },
    })

    return mutation
}