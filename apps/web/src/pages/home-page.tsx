import { Button, Checkbox, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container, Flex, Select } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/users/use-get-user"
import { useGetUserClaims } from "../hooks/claims/use-get-user-claims"
import { UserComponent } from "../components/user-component"
import { useCreateUserClaim } from "../hooks/claims/use-create-user-claim"
import { useState } from "react"
import { HeaderComponent } from "../components/header-component"
import { HeaderImage } from "../components/image-component"
import { useEditUserClaim } from "../hooks/claims/use-edit-user-claim"
import { useGetClaimTopics } from "../hooks/claims/use-bc-get-claim-topics"
import { zeroAddress } from "viem"
import { EditDocComponent } from "../components/edit-doc-component"

export const HomePage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserClaims, userClaimsData } = useGetUserClaims(address?.toString())
    const { claimTopicsData } = useGetClaimTopics()

    const [inputClaimTopic, setClaimTopic] = useState('');
    const [inputDoc, setInputDoc] = useState<File | null>(null);
    const [inputEditDoc, setInputEditDoc] = useState<File | null>(null);

    const mutation = useCreateUserClaim()
    const editMutation = useEditUserClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption placement="top">Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>User Address</Th>
                        <Th isNumeric>Claim Topic</Th>
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
                                <Td isNumeric>{element?.claimTopic}</Td>
                                <Td w={'25%'} justifyContent={'center'} justifyItems={'center'}>
                                    <HeaderImage claimTopic={element?.claimTopic} randomStr={element?.randomStr} />
                                </Td>
                                <Td>
                                    <Checkbox isChecked={element?.isClaimVerified} disabled></Checkbox>
                                </Td>
                                <Td w={'25%'}>
                                    {
                                        !element?.isClaimVerified && 
                                            <EditDocComponent address={address?.toString() ?? zeroAddress}
                                                claimTopic={element?.claimTopic ?? 0}/>
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
                                <option value={element}>
                                    {element}
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