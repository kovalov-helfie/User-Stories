import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"

export const HomePage = () => {
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
                        <Td>0x123</Td>
                        <Td isNumeric>1</Td>
                        <Td>
                            <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                        </Td>
                        <Td>
                            <Checkbox checked></Checkbox>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>0x123</Td>
                        <Td isNumeric>1</Td>
                        <Td>
                            <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                        </Td>
                        <Td>
                            <Checkbox checked></Checkbox>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>0x123</Td>
                        <Td isNumeric>1</Td>
                        <Td>
                            <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                        </Td>
                        <Td>
                            <Checkbox checked></Checkbox>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>0x123</Td>
                        <Td isNumeric>1</Td>
                        <Td>
                            <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' boxSize='75px' />
                        </Td>
                        <Td>
                            <Checkbox checked></Checkbox>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>

        <Flex w={'100%'} justifyContent={'center'}>
            <Stack spacing={3} w={'100%'} maxW={'2xl'}>
                <Input placeholder='Claim Topic' />
                <Input placeholder='Document' type="file" />
                <Button colorScheme='blue'>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}