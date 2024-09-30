import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

export const useGetObligationByAsset = (assetId: number) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['obligation', assetId],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/obligations/${assetId}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingObligationByAsset: isPending, obligationByAssetData: data }
}