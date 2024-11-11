import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetIsProcessingTokenComplianceRequest = (tokenAddress: string | undefined, userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenComplianceRequests', tokenAddress, userAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/token-compliance-requests/token-compliance-request-exists/${tokenAddress}-${userAddress}`).then((res) => res.json())
            return res;
        }

    })
    return { isPendingIsProcessing: isPending, isProcessingData: data }
}