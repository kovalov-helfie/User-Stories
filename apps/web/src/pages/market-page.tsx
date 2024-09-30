import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { HeaderComponent } from "../components/header-component"
import { UserComponent } from "../components/user-component"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/users/use-get-user"
import { useGetObligations } from "../hooks/obligations/use-get-obligations"
import { useBuyObligation } from "../hooks/obligations/use-buy-obligation"

export const MarketPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingObligations, obligationsData } = useGetObligations('true', null)

    const buyMutation = useBuyObligation()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Market Obligations</TableCaption>
                <Thead>
                    <Tr>
                        <Th isNumeric>Asset id</Th>
                        <Th>Asset Owner</Th>
                        <Th>Name</Th>
                        <Th>Desciption</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Min purchase Amount</Th>
                        <Th>Buy Asset</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {obligationsData?.map((element: any) => {
                        return (
                            <Tr key={`${element?.id}`}>
                                <Td>{element?.asset?.id}</Td>
                                <Td>{element?.userAddress}</Td>
                                <Td>{element?.asset?.name}</Td>
                                <Td>{element?.asset?.description}</Td>
                                <Td>{element?.asset?.type}</Td>
                                <Td>{element?.minPurchaseAmount}</Td>
                                <Td>
                                    <Button colorScheme='yellow' size='sm' onClick={() => {
                                            buyMutation.mutate({
                                                assetId: element?.asset?.id,
                                                userAddress: element?.userAddress,
                                                minPurchaseAmount: element?.minPurchaseAmount,
                                                obligationId: element?.obligationId
                                            })
                                        }}>
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