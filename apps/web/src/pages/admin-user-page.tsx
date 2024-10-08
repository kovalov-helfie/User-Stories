import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, Input } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetUsers } from "../hooks/users/use-get-users"
import { HeaderComponent } from "../components/header-component"
import { useCreateIdentity } from "../hooks/identities/use-create-identity"
import { useVerifyUser } from "../hooks/users/use-verify-user"
import { useAddOperator } from "../hooks/users/use-bc-add-operator"
import { useRemoveOperator } from "../hooks/users/use-bc-remove-operator"
import { useDeployIdentity } from "../hooks/identities/use-bc-deploy-identity"
import { useState } from "react"
import { useRegisterIdentity } from "../hooks/identities/use-bc-register-identity"
import { useDeleteIdentity } from "../hooks/identities/use-bc-delete-identity"
import { useBcIdentityAddKey } from "../hooks/identities/use-bc-identity-add-key"

export const AdminUserPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUsers, usersData } = useGetUsers()

    const [inputCountry, setInputCountry] = useState('');

    const deployIdentity = useDeployIdentity()
    const addKey = useBcIdentityAddKey()
    const createIdentity = useCreateIdentity()

    const verifyUserClaim = useVerifyUser()

    const useAddUser = useAddOperator()
    const registerIdentity = useRegisterIdentity()

    const useRemoveUser = useRemoveOperator()
    const deleteIdentity = useDeleteIdentity()

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
                                        {
                                            <Stack direction={"column"}>
                                                {
                                                    !element?.country || !element?.isVerified
                                                        ? <Input placeholder='Country' value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} />
                                                        : <></>
                                                }
                                                <Button isDisabled={!element?.identityAddress} colorScheme={element?.isVerified ? 'red' : 'green'} size='sm'
                                                    onClick={async () => {
                                                        if (element?.identityAddress) {
                                                            await verifyUserClaim.mutateAsync({
                                                                senderAddress: address?.toString(),
                                                                userAddress: element?.userAddress,
                                                                country: Number(inputCountry),
                                                                verify: element?.isVerified ? false : true,
                                                            })
                                                            if (element?.isVerified) {
                                                                await useRemoveUser.mutateAsync({ userAddress: element?.userAddress })
                                                                await deleteIdentity.mutateAsync({ userAddress: element?.userAddress })
                                                            } else {
                                                                await useAddUser.mutateAsync({ userAddress: element?.userAddress })
                                                                await registerIdentity.mutateAsync({
                                                                    userAddress: element?.userAddress,
                                                                    identityAddress: element?.identityAddress,
                                                                    country: Number(inputCountry),
                                                                })
                                                            }
                                                        }
                                                    }}>
                                                    {element?.isVerified ? 'Unverify' : 'Verify'}
                                                </Button>
                                            </Stack>

                                        }
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