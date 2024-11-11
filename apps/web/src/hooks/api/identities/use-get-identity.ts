import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetIdentity = (userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['identity', userAddress],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/identities/${userAddress}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingIdentity: isPending, identityData: data }
}