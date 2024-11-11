import { usePublicClient, useWriteContract } from 'wagmi'
import { TIME_MODULE, TOKEN } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Address, encodeFunctionData, Hex, parseUnits } from 'viem'
import { MODULAR_COMPLIANCE_ABI } from '../../../abis/modular-compliance.abi'
import { TIME_TRANSFER_LIMIT_ABI } from '../../../abis/modules/transfer-limit.abi'
import { TOKEN_ABI } from '../../../abis/token.abi'

export const useBcCreateTimeCompliance = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
                tokenAddress: string | undefined,
                amount: number | undefined
            }) => {
            if (!variables.userAddress || !variables.tokenAddress || !variables.amount) {
                throw new Error("No User")
            }

            try {
                const tokenDecimals = await publicClient?.readContract({
                    abi: TOKEN_ABI,
                    address: TOKEN,
                    functionName: 'decimals',
                    args: [],
                })
                if(!tokenDecimals) {
                    throw new Error("No Decimals")
                }

                const mcAddress = await publicClient?.readContract({
                    abi: TOKEN_ABI,
                    address: TOKEN,
                    functionName: 'compliance',
                    args: [],
                })

                const wc = await writeContractAsync({
                    abi: MODULAR_COMPLIANCE_ABI,
                    address: mcAddress as Address,
                    functionName: 'callModuleFunction',
                    args: [
                        encodeFunctionData(
                            {
                              abi: TIME_TRANSFER_LIMIT_ABI,
                              functionName: 'setTimeTransferLimit',
                              args: [{ limitTime: 86400, limitValue: parseUnits(variables.amount.toString(), tokenDecimals) }]
                            }
                        ),
                        TIME_MODULE
                    ],
                })
                await publicClient?.waitForTransactionReceipt({hash: wc})
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokenComplianceRequestsAdmin'] })
        },
    })

    return mutation
}