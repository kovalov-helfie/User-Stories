import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, useDisclosure, Input } from "@chakra-ui/react"
import { ObligationModal } from "../components/obligation-modal";
import { UserComponent } from "../components/user-component";
import { useAccount } from "wagmi";
import { useGetUser } from "../hooks/users/use-get-user";
import { useGetUserAssets } from "../hooks/assets/use-get-user-assets";
import { useState } from "react";
import { useCreateAsset } from "../hooks/assets/use-create-asset";
import { HeaderComponent } from "../components/header-component";
import { useDeleteObligation } from "../hooks/obligations/use-delete-obligation";
import { zeroAddress } from "viem";
import { useBcMintAsset } from "../hooks/assets/use-bc-mint-asset";

export const AssetPage = () => {
    const { isOpen, onOpen, onClose, } = useDisclosure();

    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserAssets, userAssetsData } = useGetUserAssets(address?.toString(), 'true')

    const [inputName, setInputName] = useState('');
    const [inputType, setInputType] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [assetId, setAssetId] = useState(0)

    const createAssetMutation = useCreateAsset();
    const deleteObligationMutation = useDeleteObligation();
    const useBcMint = useBcMintAsset();

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />
        {
            userData?.isVerified && <><TableContainer>
                <Table variant='simple'>
                    <TableCaption placement="top">User Assets</TableCaption>
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
                        <ObligationModal
                            isOpen={isOpen} onClose={onClose}
                            assetId={assetId} userAddress={address ?? zeroAddress} />

                        {userAssetsData?.map((element: any) => {
                            return (
                                <Tr key={`${element.id}`}>
                                    <Td>{element?.id}</Td>
                                    <Td>{element?.userAddress}</Td>
                                    <Td>{element?.name}</Td>
                                    <Td>{element?.description}</Td>
                                    <Td>{element?.type}</Td>
                                    <Td>
                                        <Stack direction={"row"}>
                                            <Button colorScheme='yellow' size='sm' onClick={() => {
                                                setAssetId(element?.id)
                                                onOpen()
                                            }}>
                                                {!element.obligationId ? 'Create obligation' : 'Edit obligation'}
                                            </Button>
                                            {
                                                element.obligationId
                                                    ?
                                                    <Button colorScheme='red' size='sm' onClick={() => {
                                                        deleteObligationMutation.mutate({
                                                            assetId: element?.id,
                                                            userAddress: element?.userAddress,
                                                            obligationId: element?.obligationId
                                                        })
                                                    }}>
                                                        Delete Obligation
                                                    </Button>
                                                    : <></>
                                            }
                                        </Stack>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
                <Flex w={'100%'} justifyContent={'center'} margin={'30px'}>
                    <Stack spacing={3} maxW={'2xl'}>
                        <Input placeholder='Name' value={inputName} onChange={(e) => setInputName(e.target.value)} />
                        <Input placeholder='Description' value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} />
                        <Input placeholder='Type' value={inputType} onChange={(e) => setInputType(e.target.value)} />

                        <Button colorScheme='blue' onClick={async () => {
                            await useBcMint.mutateAsync({ userAddress: address?.toString() })
                            await createAssetMutation.mutateAsync({
                                userAddress: address?.toString(),
                                name: inputName,
                                description: inputDescription,
                                type: inputType,
                            })
                            setInputName('')
                            setInputType('')
                            setInputDescription('')
                        }}
                        >
                            Mint Asset
                        </Button>
                    </Stack>
                </Flex>
            </>
        }
    </Container>
}