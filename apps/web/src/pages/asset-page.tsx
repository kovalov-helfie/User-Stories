import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, useDisclosure, Input, Select } from "@chakra-ui/react"
import { ObligationModal } from "../components/obligation-modal";
import { UserComponent } from "../components/user-component";
import { useAccount } from "wagmi";
import { useGetUser } from "../hooks/api/users/use-get-user";
import { useGetUserAssets } from "../hooks/api/assets/use-get-user-assets";
import { useState } from "react";
import { useCreateAsset } from "../hooks/api/assets/use-create-asset";
import { HeaderComponent } from "../components/header-component";
import { useDeleteObligation } from "../hooks/api/obligations/use-delete-obligation";
import { zeroAddress } from "viem";
import { useBcCreateAsset } from "../hooks/blockchain/assets/use-bc-create-asset";
import { AVAILABLE_DECIMALS } from "../constants";
import { MintAsset } from "../components/mint-asset";
import { useNavigate } from "react-router-dom";

export const AssetPage = () => {
    const { isOpen, onOpen, onClose, } = useDisclosure();

    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserAssets, userAssetsData } = useGetUserAssets(address?.toString(), 'true')

    const [inputName, setInputName] = useState('');
    const [inputSymbol, setInputSymbol] = useState('');
    const [inputDecimals, setInputDecimals] = useState('18');
    const initTokenAddress = userAssetsData?.length > 0 ? userAssetsData[0].tokenAddress : zeroAddress
    const [tokenAddress, setTokenAddress] = useState(initTokenAddress)

    const createAssetMutation = useCreateAsset();
    const deleteObligationMutation = useDeleteObligation();

    const bcCreateAssetMutation = useBcCreateAsset();
    const navigate = useNavigate();

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />
        {
            userData?.isVerified && <><TableContainer>
                <Table variant='simple'>
                    <TableCaption placement="top">User Assets</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Token</Th>
                            <Th>Name</Th>
                            <Th>Symbol</Th>
                            <Th>Dec</Th>
                            <Th>Verified</Th>
                            <Th>Compliance</Th>
                            <Th>Sell</Th>
                            <Th>DVD</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <ObligationModal
                            isOpen={isOpen} onClose={onClose}
                            tokenAddress={tokenAddress ?? zeroAddress}
                            userAddress={address?.toString() ?? zeroAddress} />

                        {userAssetsData?.map((element: any, index: number) => {
                            return (
                                <Tr key={`${element.tokenAddress}`}>
                                    <Td>{element?.tokenAddress}</Td>
                                    <Td>{element?.name}</Td>
                                    <Td>{element?.symbol}</Td>
                                    <Td>{element?.decimals}</Td>
                                    <Td>
                                        <Stack w={'100%'} direction={'row'}>
                                            {
                                                !element?.isVerified
                                                    ? <Button colorScheme='yellow' size='sm' onClick={() =>
                                                        navigate(`/asset-claim/${element?.tokenAddress}`)
                                                    }>
                                                        Add Claim
                                                    </Button>
                                                    :
                                                    <MintAsset
                                                        tokenAddress={element?.tokenAddress ?? zeroAddress}
                                                        userAddress={element?.userAssets[index]?.userAddress ?? zeroAddress}
                                                        isVerified={element?.isVerified}
                                                    />
                                            }
                                            <Checkbox isChecked={element?.isVerified} disabled></Checkbox>
                                        </Stack>
                                    </Td>
                                    <Td>
                                        <Button colorScheme='yellow' size='sm' onClick={() =>
                                            navigate(`/token-compliance-request/${element?.tokenAddress}`)
                                        }>
                                            Change
                                        </Button>
                                    </Td>
                                    <Td>

                                        <Stack direction={"row"}>
                                            <Button colorScheme='yellow' size='sm' isDisabled={!element?.isVerified} onClick={() => {
                                                setTokenAddress(element?.tokenAddress)
                                                onOpen()
                                            }}>
                                                {!element?.obligations[index]?.obligationId ? 'Create obligation' : 'Edit obligation'}
                                            </Button>
                                            {
                                                element?.obligations[index]?.obligationId
                                                    ?
                                                    <Button colorScheme='red' size='sm' onClick={() => {
                                                        deleteObligationMutation.mutate({
                                                            tokenAddress: element?.tokenAddress,
                                                            userAddress: element?.userAssets[index]?.userAddress,
                                                            obligationId: element?.obligations[index]?.obligationId,
                                                        })
                                                    }}>
                                                        Delete Obligation
                                                    </Button>
                                                    : <></>
                                            }
                                        </Stack>
                                    </Td>
                                    <Td>
                                        <Button colorScheme='yellow' size='sm' onClick={() =>
                                            navigate(`/dvd-transfer/${element?.tokenAddress}`)
                                        }>
                                            Orders
                                        </Button>
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
                        <Input placeholder='Symbol' value={inputSymbol} onChange={(e) => setInputSymbol(e.target.value)} />
                        <Select placeholder='Decimals' onChange={(e) => {
                            if (e.target.value !== '') {
                                setInputDecimals(e.target.value)
                            }
                        }}>
                            {
                                AVAILABLE_DECIMALS.map((element: any) => {
                                    return (
                                        <option value={element}>
                                            {element}
                                        </option>
                                    )
                                })
                            }
                        </Select>
                        <Button colorScheme='blue' onClick={async () => {
                            await bcCreateAssetMutation.mutateAsync({
                                userAddress: address?.toString(),
                                name: inputName,
                                symbol: inputSymbol,
                                decimals: Number(inputDecimals)
                            })
                            await createAssetMutation.mutateAsync({
                                userAddress: address?.toString(),
                                name: inputName,
                                symbol: inputSymbol,
                                decimals: Number(inputDecimals),
                            })
                            setInputName('')
                            setInputSymbol('')
                            setInputDecimals('18')
                        }}
                        >
                            Deploy Asset
                        </Button>
                    </Stack>
                </Flex>
            </>
        }
    </Container>
}