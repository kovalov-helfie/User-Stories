import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetTokenClaims = (tokenAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenClaims', tokenAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/token-claims/${tokenAddress}`).then((res) => res.json())
            return res.map((el:any) => ({...el, randomStr: window.crypto.randomUUID()}))
        }
    })
    return { isPendingTokenClaims: isPending, tokenClaimsData: data }
}