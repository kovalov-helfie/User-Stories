import { Button, Checkbox, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container, Flex, Select } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useGetUserClaims } from "../hooks/api/claims/use-get-user-claims"
import { UserComponent } from "../components/user-component"
import { useCreateUserClaim } from "../hooks/api/claims/use-create-user-claim"
import { useState } from "react"
import { HeaderComponent } from "../components/header-component"
import { HeaderImage } from "../components/image-component"
import { useBcGetClaimTopics } from "../hooks/blockchain/claims/use-bc-get-claim-topics"
import { zeroAddress } from "viem"
import { EditDocComponent } from "../components/edit-doc-component"
import { getClaimTopicName } from "../functions"

export const HomePage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserClaims, userClaimsData } = useGetUserClaims(address?.toString())
    const { claimTopicsData } = useBcGetClaimTopics()

    const [inputClaimTopic, setClaimTopic] = useState('');
    const [inputDoc, setInputDoc] = useState<File | null>(null);

    const mutation = useCreateUserClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption placement="top">Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>User Address</Th>
                        <Th>Claim Topic</Th>
                        <Th>Document</Th>
                        <Th>Verified</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {userClaimsData?.map((element: any) => {
                        return (
                            <Tr key={`${element?.claimUserKey}`} justifyContent={'center'}>
                                <Td>{element?.userAddress}</Td>
                                <Td>{getClaimTopicName(BigInt(element?.claimTopic))}</Td>
                                <Td w={'25%'} justifyContent={'center'} justifyItems={'center'}>
                                    <HeaderImage claimTopic={element?.claimTopic} randomStr={element?.randomStr} />
                                </Td>
                                <Td>
                                    <Checkbox isChecked={element?.isClaimVerified} disabled></Checkbox>
                                </Td>
                                <Td w={'25%'}>
                                    {
                                        !element?.isClaimVerified && 
                                            <EditDocComponent 
                                                senderAddress={address?.toString() ?? zeroAddress}
                                                address={address?.toString() ?? zeroAddress}
                                                claimTopic={element?.claimTopic ?? 0}
                                                isToken={false}/>
                                    }
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>

        <Flex w={'100%'} justifyContent={'center'} margin={'30px'}>
            <Stack spacing={3} w={'100%'} maxW={'2xl'}>
                <Select placeholder='Claim Topic' onChange={(e) => {
                    if (e.target.value !== '') {
                        setClaimTopic(e.target.value)
                    }
                }}>
                    {
                        claimTopicsData.map((element: any) => {
                            return (
                                <option value={element.value.toString()}>
                                    {element.name}
                                </option>
                            )
                        })
                    }
                </Select>
                <Input placeholder='Document' type="file" onChange={(e) => { if (e.target.files) { setInputDoc(e.target.files[0]); } }} />
                <Button colorScheme='blue' isDisabled={userData?.isVerified && inputClaimTopic !== ''} onClick={() => {
                    if (!userData?.isVerified && inputClaimTopic !== '') {
                        mutation.mutate({
                            userAddress: address?.toString(),
                            claimTopic: inputClaimTopic,
                            docgen: inputDoc,
                        })
                        setClaimTopic('')
                        setInputDoc(null)
                    }
                }}>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}