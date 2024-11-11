import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetUserClaims = (userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['userClaims', userAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/claims/${userAddress}`).then((res) => res.json())
            return res.map((el:any) => ({...el, randomStr: window.crypto.randomUUID()}))
        }

    })
    return { isPendingUserClaims: isPending, userClaimsData: data }
}