import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetAllTokenClaims = (withTokens: string) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['allTokenClaims', withTokens],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/token-claims?withTokens=${withTokens}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingTokenClaims: isPending, tokenClaimsData: data }
}