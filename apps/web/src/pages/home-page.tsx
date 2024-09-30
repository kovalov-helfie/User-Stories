import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { env } from "../env"
import { useAccount } from "wagmi"
import { useGetUser } from "../hooks/users/use-get-user"
import { useGetUserClaims } from "../hooks/claims/use-get-user-claims"
import { UserComponent } from "../components/user-component"
import { useCreateUserClaim } from "../hooks/claims/use-create-user-claim"
import { useState } from "react"
import { HeaderComponent } from "../components/header-component"

export const HomePage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserClaims, userClaimsData } = useGetUserClaims(address?.toString())
    
    const [ inputClaimTopic, setInputClaimTopic ] = useState('');
    const [ inputDoc, setInputDoc ] = useState<File | null>(null);

    const mutation = useCreateUserClaim()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setInputDoc(e.target.files[0]);
        }
      };

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData}/>
        <UserComponent userData={userData}/>

        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>User Address</Th>
                        <Th isNumeric>Claim Topic</Th>
                        <Th>Document</Th>
                        <Th>Verified</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {userClaimsData?.map((element: any) => {
                    return (
                        <Tr key={`${element.id}`}>
                            <Td>{element?.userAddress}</Td>
                            <Td isNumeric>{element?.claimTopic}</Td>
                            <Td>
                                <Image src={`${env.VITE_API_URL}/claims/claim/docgen/${element?.userAddress}-${element?.claimTopic}`} alt='Doc' boxSize='75px' />
                            </Td>
                            <Td>
                                <Checkbox isChecked={element?.isClaimVerified} disabled></Checkbox>
                            </Td>
                        </Tr>
                    )
                })}
                </Tbody>
            </Table>
        </TableContainer>

        <Flex w={'100%'} justifyContent={'center'}>
            <Stack spacing={3} w={'100%'} maxW={'2xl'}>
                <Input placeholder='Claim Topic' value={inputClaimTopic} onChange={(e) => setInputClaimTopic(e.target.value)} />
                <Input placeholder='Document' type="file" onChange={handleFileChange} />
                <Button colorScheme='blue' onClick={() => mutation.mutate({
                        userAddress: address?.toString(), 
                        claimTopic: inputClaimTopic,
                        docgen: inputDoc,
                    })}>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}