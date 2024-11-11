import { useQuery } from "@tanstack/react-query"
import { env } from "../../../env"

export const useGetUser = (userAddress: string | undefined) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['user', userAddress],
        queryFn: () => {
            try {
                if(!userAddress) {
                    return null
                }
                return fetch(`${env.VITE_API_URL}/users/${userAddress}`).then((res) => res.json())    
            } catch (error) {
                return null
            }
        }
    })
    return { isLoadingUser: isLoading, userData: data }
}