import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetTokenIdentity = (tokenAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['token-identity', tokenAddress],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/token-identities/${tokenAddress}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingIdentity: isPending, identityData: data }
}