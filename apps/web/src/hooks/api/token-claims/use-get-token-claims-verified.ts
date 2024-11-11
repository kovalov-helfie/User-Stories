import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useAllTokenClaimsVerified = (tokenAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenClaimsVerified', tokenAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/token-claims/all-verified/${tokenAddress}`).then((res) => res.json())
            return res
        }

    })
    return { isPendingVer: isPending, allTokenClaimsVerified: data }
}