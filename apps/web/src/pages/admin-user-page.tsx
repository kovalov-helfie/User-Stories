import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/users/use-get-user"
import { useAccount } from "wagmi"
import { useVerifyUserClaim } from "../hooks/claims/use-verify-user-claim"
import { useGetUsers } from "../hooks/users/use-get-users"
import { HeaderComponent } from "../components/header-component"

export const AdminUserPage = () => {
    const { address } = useAccount()
    const { isPendingUser, userData } = useGetUser(address?.toString())
    const { isPendingUsers, usersData } = useGetUsers()

    const mutation = useVerifyUserClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData}/>
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>User Address</Th>
                        <Th>Identity Address</Th>
                        <Th>Verified</Th>
                        <Th>Admin</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {usersData?.map((element: any) => {
                        return (
                            <Tr key={`${element.id}`}>
                                <Td>
                                    <Stack direction={"row"}>
                                        <Text>{element?.userAddress}</Text >
                                    </Stack>
                                </Td>
                                <Td isNumeric>{element?.identityAddress}</Td>
                                <Td>
                                    {
                                        !element?.isVerified
                                            ?
                                            <Button colorScheme='green' size='sm' onClick={() => mutation.mutate({
                                                senderAddress: address?.toString(),
                                                userAddress: element?.userAddress,
                                                claimTopic: Number(element.claimTopic),
                                                verify: true
                                            })}>
                                                Verify
                                            </Button>
                                            :
                                            <Button colorScheme='red' size='sm' onClick={() => mutation.mutate({
                                                senderAddress: address?.toString(),
                                                userAddress: element?.userAddress,
                                                claimTopic: Number(element.claimTopic),
                                                verify: false
                                            })}>
                                                Unverify
                                            </Button>
                                    }
                                </Td>
                                <Td><Checkbox size="lg" isChecked={element?.isVerified} disabled/></Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    </Container>
}