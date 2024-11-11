import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetDvdTransfersByUserAndSellerToken = (user: string | undefined, sellerToken: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['dvdTransfersUser', user],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/dvd-transfers/user/${user}-${sellerToken}`).then((res) => res.json())
            return res;
        }

    })
    return { isPendingTransfers: isPending, transfersData: data }
}