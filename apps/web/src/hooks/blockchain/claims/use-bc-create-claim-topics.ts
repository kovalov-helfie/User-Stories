import { useAccount, usePublicClient, useSignMessage, useWriteContract } from 'wagmi'
import { Address, Hex, keccak256, parseUnits, zeroAddress } from 'viem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IDENTITY_ABI } from '../../../abis/identity.abi'
import { claimSignature } from '../../../functions'
import { CLAIM_DATA, SCHEME } from '../../../constants'
import { env } from '../../../env';

export const useBcCreateClaim = (isToken?: boolean) => {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const { writeContractAsync } = useWriteContract()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient()
  const claimPath = isToken ? 'token-claims' : 'claims';

  const mutation = useMutation({
    mutationFn: async (
      variables: {
        senderAddress: string | undefined,
        address: string | undefined,
        identityAddress: string | undefined,
        claimTopic: bigint,
        data: string,
      }) => {
      if (!variables.senderAddress || !variables.address || !variables.identityAddress) {
        throw new Error("No Sender")
      }

      try {
        const uri = `${env.VITE_API_URL}/${claimPath}/claim/docgen/${variables.senderAddress}/${variables.claimTopic}-${variables.address}`;
        const docData = variables.data as Hex;
        const message = claimSignature(variables.identityAddress as Address, variables.claimTopic, docData)
        const signature = await signMessageAsync({ message: message, account: address })
        console.warn(signature)
        const wc = await writeContractAsync({
          abi: IDENTITY_ABI,
          address: variables.identityAddress as Address,
          functionName: 'addClaim',
          args: [
            variables.claimTopic,
            SCHEME,
            variables.identityAddress as Address,
            signature,
            docData,
            uri,
          ],
        })
        await publicClient?.waitForTransactionReceipt({hash: wc})
      } catch (error) {
        console.error(error)
      }
    },
    onSuccess: () => {
      const query = isToken ? 'tokenClaims' : 'claims'
      queryClient.invalidateQueries({ queryKey: [query] })
    },
  })

  return mutation
}