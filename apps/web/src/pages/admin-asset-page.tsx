import { Button, Checkbox, Text, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetAssets } from "../hooks/api/assets/use-get-assets"
import { HeaderComponent } from "../components/header-component"
import { useCreateTokenIdentity } from "../hooks/api/token-identities/use-create-token-identity"
import { useBcIdentityAddKey } from "../hooks/blockchain/identities/use-bc-identity-add-key"
import { zeroAddress } from "viem"
import { VerifyAsset } from "../components/verify-asset"
import { useNavigate } from "react-router-dom"

export const AdminAssetPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingAssets, assetsData } = useGetAssets('false')

    const addKey = useBcIdentityAddKey()
    const createIdentity = useCreateTokenIdentity()
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
                            <Th>Token Address</Th>
                            <Th>Identity Address</Th>
                            <Th>Country</Th>
                            <Th>Claims</Th>
                            <Th>Verified</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {assetsData?.map((element: any) => {
                            return (
                                <Tr key={`${element?.tokenAddress}`}>
                                    <Td>
                                        <Stack direction={"row"}>
                                            <Text>{element?.tokenAddress}</Text>
                                            <Checkbox size="lg" isChecked={element?.isVerified} disabled />
                                        </Stack>
                                    </Td>
                                    <Td>{
                                        !element?.identityAddress
                                            ?
                                            <Button colorScheme='blue' size='sm' onClick={async () => {
                                                if (!element?.identityAddress) {
                                                    await addKey.mutateAsync({
                                                        address: element?.tokenAddress,
                                                        senderAddress: address?.toString()
                                                    })
                                                    await createIdentity.mutateAsync({
                                                        tokenAddress: element?.tokenAddress,
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
                                                navigate(`/admin-asset-claim/${element?.tokenAddress}`)
                                            }
                                        }

                                        }>
                                            Verify
                                        </Button>
                                    </Td>
                                    <Td>
                                        <VerifyAsset country={element?.country ?? '0'}
                                            isVerified={element?.isVerified ?? false}
                                            identityAddress={element?.identityAddress ?? zeroAddress}
                                            address={address?.toString() ?? zeroAddress}
                                            tokenAddress={element?.tokenAddress?.toString() ?? zeroAddress} />
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        }
    </Container>
}