import { Button, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useBcMintAsset } from "../hooks/blockchain/assets/use-bc-mint-asset";

export function MintAsset({ isVerified, tokenAddress, userAddress }:
    { isVerified: boolean, tokenAddress: string, userAddress: string }) {
    const [inputAmount, setInputAmount] = useState('0');

    const mintAsset = useBcMintAsset();

    return (
        <Stack direction={"column"}>
            {
                isVerified
                    ? <Input placeholder='Amount' value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} />
                    : <></>
            }
            <Button isDisabled={!isVerified} colorScheme='yellow' size='sm'
                onClick={async () => {
                        if (isVerified) {
                            await mintAsset.mutateAsync({ 
                                tokenAddress: tokenAddress,
                                userAddress: userAddress,
                                amount: BigInt(inputAmount)
                            })
                        }
                    }
                }>
                Mint
            </Button>
        </Stack>
    )
}