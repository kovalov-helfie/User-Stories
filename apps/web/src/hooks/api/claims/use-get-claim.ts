import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetClaim = (userAddress: string | undefined, claimTopic: number | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['claim', `${userAddress}-${claimTopic}`],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/claims/claim/${userAddress}-${claimTopic}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingClaim: isPending, claimData: data }
}