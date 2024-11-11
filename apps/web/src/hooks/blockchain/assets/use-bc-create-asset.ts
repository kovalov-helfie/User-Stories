import { usePublicClient, useWriteContract } from 'wagmi'
import { Address, zeroAddress, encodeFunctionData, Hex, parseUnits } from 'viem'
import { COUNTRY_ALLOW_MODULE, TIME_MODULE, TOKEN_FACTORY } from '../../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TOKEN_FACTORY_ABI } from '../../../abis/token-factory.abi'
import { COUNTRY_ALLOW_ABI } from '../../../abis/modules/country-allow.abi'
import { TIME_TRANSFER_LIMIT_ABI } from '../../../abis/modules/transfer-limit.abi'

export const useBcCreateAsset = () => {
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        userAddress: string | undefined,
        name: string | undefined,
        symbol: string | undefined,
        decimals: number | undefined
      }) => {
      if (!variables.userAddress || !variables.name || !variables.symbol || !variables.decimals) {
        throw new Error("No User")
      }
      const tokenDetails = {
        name: variables.name,
        symbol: variables.symbol,
        decimals: variables.decimals,
        ONCHAINID: zeroAddress as Address,
        complianceModules: [COUNTRY_ALLOW_MODULE, TIME_MODULE] as Address[],
        complianceSettings: [
          encodeFunctionData(
            {
              abi: COUNTRY_ALLOW_ABI,
              functionName: 'batchAllowCountries',
              args: [[267]]
            }
          ),
          encodeFunctionData(
            {
              abi: TIME_TRANSFER_LIMIT_ABI,
              functionName: 'setTimeTransferLimit',
              args: [{ limitTime: 86400, limitValue: parseUnits('1000', variables.decimals) }]
            }
          )
        ] as Hex[],
      }

      try {
        const wc = await writeContractAsync({
          abi: TOKEN_FACTORY_ABI,
          address: TOKEN_FACTORY,
          functionName: 'deployToken',
          args: [tokenDetails],
        })
        await publicClient?.waitForTransactionReceipt({ hash: wc })
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