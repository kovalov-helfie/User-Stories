import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"

export const AdminPage = () => {
    return <Container maxW={'8xl'} w={'100%'}>
    <Stack direction={"row"} justifyContent={'space-between'} margin={'30px'}>
        <w3m-button />
        <Stack direction={'row'}>
            <Button colorScheme='blue' size='sm'>
                Your Identity 0x123
            </Button>
            <Checkbox colorScheme='green' size='lg' disabled>User verified</Checkbox>
        </Stack>
    </Stack>

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
                <Tr>
                    <Td>
                        <Stack direction={"row"}>
                            <Text>0x123</Text >
                            <Checkbox colorScheme='green' size='sm' disabled>User verified</Checkbox>
                        </Stack>
                    </Td>
                    <Td isNumeric>1</Td>
                    <Td>
                        <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                    </Td>
                    <Td>
                        <Button colorScheme="green">Verify</Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td>
                        <Stack direction={"row"}>
                            <Text>0x123</Text >
                            <Checkbox colorScheme='green' size='sm' disabled>User verified</Checkbox>
                        </Stack>
                    </Td>
                    <Td isNumeric>1</Td>
                    <Td>
                        <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                    </Td>
                    <Td>
                        <Button colorScheme="green">Verify</Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td>
                        <Stack direction={"row"}>
                            <Text>0x123</Text >
                            <Checkbox colorScheme='green' size='sm' disabled>User verified</Checkbox>
                        </Stack>
                    </Td>
                    <Td isNumeric>1</Td>
                    <Td>
                        <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                    </Td>
                    <Td>
                        <Button colorScheme="green">Verify</Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td>
                        <Stack direction={"row"}>
                            <Text>0x123</Text >
                            <Checkbox colorScheme='green' size='sm' disabled>User verified</Checkbox>
                        </Stack>
                    </Td>
                    <Td isNumeric>1</Td>
                    <Td>
                        <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                    </Td>
                    <Td>
                        <Button colorScheme="red">Unerify</Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    </TableContainer>
</Container>
}