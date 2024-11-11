import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetAsset = (assetAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['asset', assetAddress],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/assets/asset/${assetAddress}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingAsset: isPending, assetData: data }
}