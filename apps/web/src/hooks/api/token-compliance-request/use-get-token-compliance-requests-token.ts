import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetTokenComplianceRequestsToken = (tokenAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenComplianceRequestsToken', tokenAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/token-compliance-requests/${tokenAddress}`).then((res) => res.json())
            return res;
        }

    })
    return { isPendingRequest: isPending, requestsData: data }
}