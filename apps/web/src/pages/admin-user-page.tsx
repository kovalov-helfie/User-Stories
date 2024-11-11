import { Button, Checkbox, Text, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetUsers } from "../hooks/api/users/use-get-users"
import { HeaderComponent } from "../components/header-component"
import { useCreateIdentity } from "../hooks/api/identities/use-create-identity"
import { useDeployIdentity } from "../hooks/blockchain/identities/use-bc-deploy-identity"
import { useBcIdentityAddKey } from "../hooks/blockchain/identities/use-bc-identity-add-key"
import { VerifyUser } from "../components/verify-user"
import { zeroAddress } from "viem"
import { useNavigate } from "react-router-dom"

export const AdminUserPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUsers, usersData } = useGetUsers()

    const deployIdentity = useDeployIdentity()
    const addKey = useBcIdentityAddKey(true)
    const createIdentity = useCreateIdentity()

    const navigate = useNavigate();

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
                            <Th>Claims</Th>
                            <Th>Verified</Th>
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
                                                        address: element?.userAddress,
                                                        senderAddress: address?.toString()
                                                    })
                                                    await addKey.mutateAsync({
                                                        address: element?.userAddress,
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
                                        <Button colorScheme='yellow' size='sm' isDisabled={!element?.identityAddress} onClick={() => {
                                            if (element?.identityAddress) {
                                                navigate(`/admin-claim/${element?.userAddress}`)
                                            }
                                        }
                                        }>
                                            Verify
                                        </Button>
                                    </Td>
                                    <Td>
                                        <VerifyUser country={element?.country ?? '0'}
                                            isVerified={element?.isVerified ?? false}
                                            identityAddress={element?.identityAddress ?? zeroAddress}
                                            address={address?.toString() ?? zeroAddress}
                                            userAddress={element?.userAddress?.toString() ?? zeroAddress} />
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