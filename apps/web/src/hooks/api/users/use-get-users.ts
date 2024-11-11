import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetUsers = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ['users'],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/users`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingUsers: isPending, usersData: data }
}
