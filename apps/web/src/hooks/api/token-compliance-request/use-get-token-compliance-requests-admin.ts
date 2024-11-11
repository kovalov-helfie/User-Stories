import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetTokenComplianceRequestsAdmin = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenComplianceRequestsAdmin'],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/token-compliance-requests/all-for-admin`).then((res) => res.json())
            return res;
        }

    })
    return { isPendingRequest: isPending, requestsData: data }
}