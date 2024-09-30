import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

export const useGetObligationByAsset = (assetId: number) => {
    const { isLoading, error, data, } = useQuery({
        queryKey: ['obligation', assetId],
        queryFn: async () => {
            try {
                return await fetch(`${env.VITE_API_URL}/obligations/${assetId}`).then((res) => res.json())
            } catch (error) {
                return null
            }
        }
    })
    return { isLoadingObligationByAsset: isLoading, obligationByAssetData: data }
}