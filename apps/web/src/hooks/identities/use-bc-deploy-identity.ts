import { usePublicClient, useWriteContract } from 'wagmi'
import { IDENTITY_FACTORY } from '../../addresses'
import { ID_FACTORY_ABI } from '../../abis/identity-factory.abi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pad, Address, Hex } from 'viem'

export const useDeployIdentity = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
                senderAddress: string | undefined,
                    }) => {
            if (!variables.userAddress) {
                throw new Error("No User")
            }

            try {
                const wc = await writeContractAsync({
                    abi: ID_FACTORY_ABI,
                    address: IDENTITY_FACTORY,
                    functionName: 'createIdentityWithManagementKeys',
                    args: [
                        variables.userAddress as Address,
                        variables.userAddress as Address,
                        [pad(variables.senderAddress as Hex)]
                    ],
                })
                await publicClient?.waitForTransactionReceipt({hash: wc})
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAssets'] })
        },
    })

    return mutation
}