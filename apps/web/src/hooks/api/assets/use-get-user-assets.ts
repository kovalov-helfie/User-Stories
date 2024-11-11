import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetUserAssets = (userAddress: string | undefined, withObligations: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['userAssets', userAddress],
        queryFn: () =>
            fetch(`${env.VITE_API_URL}/assets/${userAddress}?withObligations=${withObligations}`).then((res) =>
            res.json(),
        ),
    })
    return { isPendingUserAssets: isPending, userAssetsData: data }
}