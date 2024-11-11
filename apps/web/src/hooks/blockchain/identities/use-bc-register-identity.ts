import { usePublicClient, useWriteContract } from 'wagmi'
import { IR } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IR_ABI } from '../../../abis/ir.abi'
import { Address } from 'viem'

export const useRegisterIdentity = (isToken?: boolean) => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                address: string | undefined,
                identityAddress: string | undefined,
                country: number,
            }) => {
            if (!variables.address) {
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
                        variables.address as Address,
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
            const query = isToken ? 'assets' : 'users';
            queryClient.invalidateQueries({ queryKey: [query] })
        },
    })

    return mutation
}