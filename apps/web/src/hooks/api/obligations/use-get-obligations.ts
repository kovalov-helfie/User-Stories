import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetObligations = (withAssets: string, isNotExecuted: string | null) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['obligations', withAssets, isNotExecuted],
        queryFn: () => {
            const str = isNotExecuted === null 
                ? `${env.VITE_API_URL}/obligations?withAssets=${withAssets}`
                : `${env.VITE_API_URL}/obligations?withAssets=${withAssets}&isNotExecuted=${isNotExecuted}`
            return fetch(str).then((res) =>res.json())
        }   
    })
    return { isPendingObligations: isPending, obligationsData: data }
}