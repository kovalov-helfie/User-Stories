import { usePublicClient, useWriteContract } from 'wagmi'
import { IDENTITY_FACTORY } from '../../../addresses'
import { ID_FACTORY_ABI } from '../../../abis/identity-factory.abi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pad, Address, Hex, keccak256 } from 'viem'

export const useDeployIdentity = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                address: string | undefined,
                senderAddress: string | undefined,
                    }) => {
            if (!variables.address || !variables.senderAddress) {
                throw new Error("No User")
            }

            try {
                let wc;
                if(variables.address.toLowerCase() !== variables.senderAddress.toLowerCase()) {
                    wc = await writeContractAsync({
                        abi: ID_FACTORY_ABI,
                        address: IDENTITY_FACTORY,
                        functionName: 'createIdentityWithManagementKeys',
                        args: [
                            variables.address as Address,
                            variables.address as Address,
                            [keccak256(pad(variables.senderAddress as Hex))]
                        ],
                    })
                } else {
                    wc = await writeContractAsync({
                        abi: ID_FACTORY_ABI,
                        address: IDENTITY_FACTORY,
                        functionName: 'createIdentity',
                        args: [
                            variables.senderAddress as Address,
                            variables.address as Address
                        ],
                    })
                } 
                
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