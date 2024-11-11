import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useAllUserClaimsVerified = (userAddress: string | undefined) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['userClaimsVerified', userAddress],
        queryFn: async () => {
            const res = await fetch(`${env.VITE_API_URL}/claims/all-verified/${userAddress}`).then((res) => res.json())
            return res;
        }

    })
    return { isPendingVer: isPending, allUserClaimsVerified: data }
}