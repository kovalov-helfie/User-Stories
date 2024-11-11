import { usePublicClient, useWriteContract } from 'wagmi'
import { TIR_ABI } from '../../../abis/tir.abi'
import { TIR } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'

export const useAddOperator = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
            }) => {
            if (!variables.userAddress) {
                throw new Error("No User")
            }

            try {
                const wc = await writeContractAsync({
                    abi: TIR_ABI,
                    address: TIR,
                    functionName: 'addOperator',
                    args: [
                        variables.userAddress as Address,
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