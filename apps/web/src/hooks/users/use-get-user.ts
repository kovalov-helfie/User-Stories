import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

export const useGetUser = (userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['user'],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/users/${userAddress}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingUser: isPending, userData: data }
}