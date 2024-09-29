import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"

export const AssetPage = () => {
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
            <TableCaption>Assets</TableCaption>
            <Thead>
                <Tr>
                    <Th isNumeric>Asset id</Th>
                    <Th>User Address</Th>
                    <Th>Name</Th>
                    <Th>Desciption</Th>
                    <Th>Type</Th>
                    <Th>Sell</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td isNumeric>0</Td>
                    <Td>0x123</Td>
                    <Td>Test Asset 1</Td>
                    <Td>This is a Test Asset 1</Td>
                    <Td>RWA Test Asset 1</Td>
                    <Td>
                        <Button colorScheme='orange' size='sm'>
                            Unsell this asset
                        </Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td isNumeric>1</Td>
                    <Td>0x123</Td>
                    <Td>Test Asset 2</Td>
                    <Td>This is a Test Asset 2</Td>
                    <Td>RWA Test Asset 2</Td>
                    <Td>
                        <Button colorScheme='yellow' size='sm'>
                            Sell this asset
                        </Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td isNumeric>2</Td>
                    <Td>0x123</Td>
                    <Td>Test Asset 3</Td>
                    <Td>This is a Test Asset 3</Td>
                    <Td>RWA Test Asset 3</Td>
                    <Td>
                        <Button colorScheme='yellow' size='sm'>
                            Sell this asset
                        </Button>
                    </Td>
                </Tr>
                <Tr>
                    <Td isNumeric>3</Td>
                    <Td>0x123</Td>
                    <Td>Test Asset 4</Td>
                    <Td>This is a Test Asset 4</Td>
                    <Td>RWA Test Asset 4</Td>
                    <Td>
                        <Button colorScheme='yellow' size='sm'>
                            Sell this asset
                        </Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    </TableContainer>
</Container>
}