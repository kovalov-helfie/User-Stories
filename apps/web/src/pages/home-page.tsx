import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { env } from "../env"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/users/use-get-user"
import { useGetUserClaims } from "../hooks/claims/use-get-user-claims"
import { UserComponent } from "../components/user-component"
import { useCreateUserClaim } from "../hooks/claims/use-create-user-claim"
import { useReducer, useState } from "react"
import { HeaderComponent } from "../components/header-component"
import { HeaderImage } from "../components/image-component"
import { useEditUserClaim } from "../hooks/claims/use-edit-user-claim"

export const HomePage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserClaims, userClaimsData } = useGetUserClaims(address?.toString())

    const [inputClaimTopic, setInputClaimTopic] = useState('');
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
                                    <HeaderImage claimTopic={element?.claimTopic} randomStr={element?.randomStr}/>
                                </Td>
                                <Td>
                                    <Checkbox isChecked={element?.isClaimVerified} disabled></Checkbox>
                                </Td>
                                <Td w={'25%'}>
                                    {
                                        !element?.isClaimVerified && <Flex w={'100%'} justifyContent={'center'}>
                                            <Stack spacing={3} w={'100%'} direction={'row'} maxW={'2xl'}>
                                                <Input placeholder='Document' type="file" w={'50%'} onChange={(e) => { if (e.target.files) { setInputEditDoc(e.target.files[0]); } }} />
                                                <Button colorScheme='yellow' size={'m'} w={'50%'} onClick={() => {
                                                    editMutation.mutate({
                                                        userAddress: address?.toString(),
                                                        claimTopic: element?.claimTopic,
                                                        docgen: inputEditDoc,
                                                    })
                                                    setInputEditDoc(null)
                                                }}>
                                                    Edit Claim Topic
                                                </Button>
                                            </Stack>
                                        </Flex>
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
                <Input placeholder='Claim Topic' value={inputClaimTopic} onChange={(e) => setInputClaimTopic(e.target.value)} />
                <Input placeholder='Document' type="file" onChange={(e) => { if (e.target.files) { setInputDoc(e.target.files[0]); } }} />
                <Button colorScheme='blue' onClick={() => {
                    mutation.mutate({
                        userAddress: address?.toString(),
                        claimTopic: inputClaimTopic,
                        docgen: inputDoc,
                    })
                    setInputClaimTopic('')
                    setInputDoc(null)
                }}>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}