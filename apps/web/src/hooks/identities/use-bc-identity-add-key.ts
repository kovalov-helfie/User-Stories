import { usePublicClient, useWriteContract } from 'wagmi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../abis/identity.abi'
import { ID_FACTORY_ABI } from '../../abis/identity-factory.abi'
import { IDENTITY_FACTORY } from '../../addresses'
import { Address, keccak256, pad } from 'viem'
import { KeysTypes } from '../../types'

export const useBcIdentityAddKey = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient();

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
                senderAddress: string | undefined,
            }) => {
            if (!variables.userAddress || !publicClient) {
                throw new Error("No User")
            }

            try {
                const identityAddress = await publicClient.readContract({
                    abi: ID_FACTORY_ABI,
                    address: IDENTITY_FACTORY,
                    functionName: 'getIdentity',
                    args: [variables.userAddress as Address],
                })

                const addKey = await writeContractAsync({
                    abi: IDENTITY_ABI,
                    address: identityAddress as Address,
                    functionName: 'addKey',
                    args: [
                        keccak256(pad(variables.senderAddress as Address)),
                        BigInt(KeysTypes.CLAIM),
                        BigInt(1)
                    ],
                })
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