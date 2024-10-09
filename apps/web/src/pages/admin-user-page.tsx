import { Button, Checkbox, Text, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetUsers } from "../hooks/users/use-get-users"
import { HeaderComponent } from "../components/header-component"
import { useCreateIdentity } from "../hooks/identities/use-create-identity"
import { useDeployIdentity } from "../hooks/identities/use-bc-deploy-identity"
import { useBcIdentityAddKey } from "../hooks/identities/use-bc-identity-add-key"
import { VerifyUser } from "../components/verify-user"
import { zeroAddress } from "viem"

export const AdminUserPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUsers, usersData } = useGetUsers()

    const deployIdentity = useDeployIdentity()
    const addKey = useBcIdentityAddKey()
    const createIdentity = useCreateIdentity()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        {
            userData?.isAdmin && <TableContainer>
                <Table variant='simple'>
                    <TableCaption placement="top">Users</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>User Address</Th>
                            <Th>Identity Address</Th>
                            <Th>Country</Th>
                            <Th>Verified</Th>
                            <Th>Admin</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {usersData?.map((element: any) => {
                            return (
                                <Tr key={`${element?.userAddress}`}>
                                    <Td>
                                        <Stack direction={"row"}>
                                            <Text>{element?.userAddress}</Text>
                                            <Checkbox size="lg" isChecked={element?.isVerified} disabled />
                                        </Stack>
                                    </Td>
                                    <Td>{
                                        !element?.identityAddress
                                            ?
                                            <Button colorScheme='blue' size='sm' onClick={async () => {
                                                if (!element?.identityAddress) {
                                                    await deployIdentity.mutateAsync({
                                                        userAddress: element?.userAddress,
                                                        senderAddress: address?.toString()
                                                    })
                                                    await addKey.mutateAsync({
                                                        userAddress: element?.userAddress,
                                                        senderAddress: address?.toString()
                                                    })
                                                    await createIdentity.mutateAsync({
                                                        userAddress: element?.userAddress,
                                                        senderAddress: address?.toString()
                                                    })
                                                }
                                            }}>
                                                Deploy Identity
                                            </Button>
                                            : element?.identityAddress
                                    }
                                    </Td>
                                    <Td>
                                        <Stack direction={"row"}>
                                            <Text>{element?.country ? element?.country : "not verified"}</Text >
                                        </Stack>
                                    </Td>
                                    <Td>
                                        <VerifyUser country={element?.country ?? '0'}
                                            isVerified={element?.isVerified ?? false}
                                            identityAddress={element?.identityAddress ?? zeroAddress}
                                            address={address?.toString() ?? zeroAddress}
                                            userAddress={address?.toString() ?? zeroAddress} />
                                    </Td>
                                    <Td><Checkbox size="lg" isChecked={element?.isAdmin} disabled /></Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        }
    </Container>
}