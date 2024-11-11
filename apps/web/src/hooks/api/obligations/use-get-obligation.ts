import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetObligationByAssetAndSeller = (tokenAddress: string, seller: string) => {
    const { isLoading, error, data, } = useQuery({
        queryKey: ['obligation', tokenAddress, seller],
        queryFn: async () => {
            try {
                return await fetch(`${env.VITE_API_URL}/obligations/${tokenAddress}-${seller}`).then((res) => res.json())
            } catch (error) {
                return null
            }
        }
    })
    return { isLoadingObligationByAsset: isLoading, obligationByAssetData: data }
}