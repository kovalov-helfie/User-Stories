import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, Link, Input, TagLabel, FormControl, FormLabel } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetClaims } from "../hooks/api/claims/use-get-claims"
import { env } from "../env"
import { useVerifyUserClaim } from "../hooks/api/claims//use-verify-user-claim"
import { HeaderComponent } from "../components/header-component"
import { useBcCreateClaim } from "../hooks/blockchain/claims/use-bc-create-claim-topics"
import { useBcRemoveClaim } from "../hooks/blockchain/claims/use-bc-remove-claim-topics"
import { getClaimTopicName } from "../functions"
import { useParams } from "react-router-dom"
import { useGetUserClaims } from "../hooks/api/claims/use-get-user-claims"

export const AdminClaimPage = () => {
    const { address } = useAccount()
    const { userAddress } = useParams()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserClaims, userClaimsData } = useGetUserClaims(userAddress)

    const verifyClaim = useVerifyUserClaim()
    const addClaim = useBcCreateClaim()
    const removeClaim = useBcRemoveClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        {
            userData?.isAdmin ?
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption placement="top">Claim Topics</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>User Address</Th>
                                <Th>Claim Topic</Th>
                                <Th>Document</Th>
                                <Th>Verified</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {userClaimsData?.map((element: any) => {
                                return (
                                    <Tr key={`${element?.claimUserKey}`}>
                                        <Td>
                                            <Stack direction={"row"}>
                                                <Text>{element?.userAddress}</Text>
                                                <Checkbox size={'lg'} isChecked={element?.user.isVerified} disabled />
                                            </Stack>
                                        </Td>
                                        <Td>
                                            <Text>{getClaimTopicName(BigInt(element?.claimTopic))}</Text >
                                        </Td>
                                        <Td>
                                            <Image src={`${env.VITE_API_URL}/claims/claim/docgen/${address?.toString()}/${element?.userAddress}-${element?.claimTopic}`} alt='Doc' boxSize='75px' />
                                        </Td>
                                        <Td>
                                            {
                                                !element?.user.isVerified
                                                    ?
                                                    <Button colorScheme={!element?.isClaimVerified ? "green" : "red"} size='sm'
                                                        isDisabled={element?.user.isVerified || element?.user?.identityAddress === null} onClick={async () => {
                                                            if (!element?.user.isVerified && element?.user?.identityAddress !== null) {
                                                                if (!element?.isClaimVerified) {
                                                                    await addClaim.mutateAsync({
                                                                        senderAddress: address?.toString(),
                                                                        address: element?.userAddress,
                                                                        identityAddress: element?.user?.identityAddress,
                                                                        claimTopic: BigInt(element?.claimTopic),
                                                                        data: element?.data,
                                                                    })
                                                                } else {
                                                                    await removeClaim.mutateAsync({
                                                                        address: address?.toString(),
                                                                        identityAddress: element?.user?.identityAddress,
                                                                        claimTopic: BigInt(element?.claimTopic)
                                                                    })
                                                                }
                                                                await verifyClaim.mutateAsync({
                                                                    senderAddress: address?.toString(),
                                                                    userAddress: element?.userAddress,
                                                                    claimTopic: Number(element?.claimTopic),
                                                                    verify: !element?.isClaimVerified
                                                                })
                                                            }
                                                        }}>
                                                        {!element?.isClaimVerified ? "Verify" : "Unverify"}
                                                    </Button>
                                                    : <Checkbox size={'lg'} isChecked={element?.user.isVerified} disabled />
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