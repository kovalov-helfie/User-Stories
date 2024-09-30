import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

export const useGetObligations = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ['obligations'],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/obligations`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingObligations: isPending, obligationsData: data }
}