import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetTokenClaim = (tokenAddress: string | undefined, claimTopic: number | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['tokenClaim', `${tokenAddress}-${claimTopic}`],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/token-claims/claim/${tokenAddress}-${claimTopic}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingClaim: isPending, claimData: data }
}