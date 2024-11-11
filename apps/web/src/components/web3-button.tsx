import { Button } from "@chakra-ui/react"
import { useAppKit } from "@reown/appkit/react"
import { useAccount } from "wagmi"
import { useCreateUser } from "../hooks/api/users/use-create-user"
import { useEffect } from "react"
import { useGetUser } from "../hooks/api/users/use-get-user"

export const Web3Button = () => {
    const { address } = useAccount()
    const { open, close } = useAppKit()
    const useCreateUserMutation = useCreateUser()
    const { isLoadingUser, userData} = useGetUser(address)

    const onClick = () => {
        open({view: address ? 'Account' : 'Connect'})
    } 

    useEffect(() => {
        if(address) {
            if(!isLoadingUser && (!userData || userData?.length === 0)) {
                useCreateUserMutation.mutate({userAddress: address})
            }
        }
    }, [address, isLoadingUser, userData])

    return <Button onClick={onClick} colorScheme={'blue'}>
        { address ? address : 'Connect Wallet'}
    </Button>
}