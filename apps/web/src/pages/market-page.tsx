import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { HeaderComponent } from "../components/header-component"
import { UserComponent } from "../components/user-component"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useGetObligations } from "../hooks/api/obligations/use-get-obligations"
import { useUpdateObligation } from "../hooks/api/obligations/use-update-obligation"
import { useBcInitDvdTransfers } from "../hooks/blockchain/dvd-transfers/use-bc-init-dvd-transfers"
import { USDT } from "../addresses"
import { BuyerPrice } from "../components/buyer-price"
import { useBcBuyerApprove } from "../hooks/blockchain/dvd-transfers/use-buyer-approve"

export const MarketPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingObligations, obligationsData } = useGetObligations('true', 'false')
    const updateObligation = useUpdateObligation()
    const buyerApprove = useBcBuyerApprove()
    const initDvdTransfers = useBcInitDvdTransfers()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption placement="top">Market Obligations</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Asset</Th>
                        <Th>Seller</Th>
                        <Th>Name</Th>
                        <Th>Symbol</Th>
                        <Th>Sell Amount</Th>
                        <Th>Spend Amount</Th>
                        <Th>Agree</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {obligationsData?.map((element: any) => {
                        return (
                            <Tr key={`${element?.obligationId}`}>
                                <Td>{element?.tokenAddress}</Td>
                                <Td>{element?.seller}</Td>
                                <Td>{element?.asset?.name}</Td>
                                <Td>{element?.asset?.symbol}</Td>
                                <Td>{element?.amount}</Td>
                                <BuyerPrice sellAmount={element?.amount} sellerToken={element?.tokenAddress}/>
                                <Td>
                                    <Button colorScheme='yellow' size='sm' onClick={async () => {
                                        if(userData?.isVerified && element?.seller.toLowerCase() !== userData?.userAddress?.toLowerCase()) {
                                            await buyerApprove.mutateAsync({
                                                userAddress: userData?.userAddress, 
                                                buyerToken: USDT,
                                                sellerAmount: element?.amount,
                                                sellerToken: element?.tokenAddress,
                                            })
                                            await updateObligation.mutateAsync({
                                                userAddress: userData?.userAddress,
                                                obligationId: element?.obligationId
                                            })
                                            await initDvdTransfers.mutateAsync({
                                                obligationId: element?.obligationId,
                                                buyer: userData?.userAddress,
                                                buyerToken: USDT,
                                                seller: element?.seller,
                                                sellerAmount: element?.amount,
                                                sellerToken: element?.tokenAddress,
                                                txCount: element?.txCount,
                                            })   
                                        }
                                        }} isDisabled={!userData?.isVerified || element?.seller.toLowerCase() === userData?.userAddress?.toLowerCase()}>
                                            Buy
                                    </Button>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    </Container>
}