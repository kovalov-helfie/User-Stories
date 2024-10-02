import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, Link } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetClaims } from "../hooks/claims/use-get-claims"
import { env } from "../env"
import { useVerifyUserClaim } from "../hooks/claims/use-verify-user-claim"
import { HeaderComponent } from "../components/header-component"

export const AdminClaimPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingClaims, claimsData } = useGetClaims('true')

    const mutation = useVerifyUserClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData}/>
        <UserComponent userData={userData} />

        {
            userData?.isAdmin ?
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption placement="top">Claim Topics</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>User Address</Th>
                                <Th isNumeric>Claim Topic</Th>
                                <Th>Document</Th>
                                <Th>Verified</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {claimsData?.map((element: any) => {
                                return (
                                    <Tr key={`${element.id}`}>
                                        <Td>
                                            <Stack direction={"row"}>
                                                <Text>{element?.userAddress}</Text>
                                                <Checkbox size={'lg'} isChecked={element?.user.isVerified} disabled />
                                            </Stack>
                                        </Td>
                                        <Td isNumeric>{element?.claimTopic}</Td>
                                        <Td>
                                            <Image src={`${env.VITE_API_URL}/claims/claim/docgen/${address?.toString()}/${element?.userAddress}-${element?.claimTopic}`} alt='Doc' boxSize='75px' />
                                        </Td>
                                        <Td>
                                            {
                                                !element?.isClaimVerified
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
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                : <></>
        }
    </Container>
}