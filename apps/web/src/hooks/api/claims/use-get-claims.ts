import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetClaims = (withUsers: string) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['claims', withUsers],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/claims?withUsers=${withUsers}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingClaims: isPending, claimsData: data }
}