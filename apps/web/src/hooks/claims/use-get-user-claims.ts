import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

export const useGetUserClaims = (userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['userClaims', userAddress],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/claims/${userAddress}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingUserClaims: isPending, userClaimsData: data }
}