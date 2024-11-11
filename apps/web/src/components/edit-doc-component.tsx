import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useEditUserClaim } from "../hooks/api/claims/use-edit-user-claim";
import { useEditTokenClaim } from "../hooks/api/token-claims/use-edit-token-claim";

export function EditDocComponent({ senderAddress, address, claimTopic, isToken }: { senderAddress: string, address: string, claimTopic: string, isToken?: boolean}) {
    const [inputEditDoc, setInputEditDoc] = useState<File | null>(null);
    const editMutation = useEditUserClaim()
    const editTokenMutation = useEditTokenClaim()

    return (
        <Flex w={'100%'} justifyContent={'center'}>
            <Stack spacing={3} w={'100%'} direction={'row'} maxW={'2xl'}>
                <Input placeholder='Document' type="file" w={'50%'} onChange={(e) => { if (e.target.files) { setInputEditDoc(e.target.files[0]); } }} />
                <Button colorScheme='yellow' size={'m'} w={'50%'} onClick={() => {
                    if(isToken) {
                        editTokenMutation.mutate({
                            senderAddress: senderAddress?.toString(),
                            tokenAddress: address?.toString(),
                            claimTopic: claimTopic,
                            docgen: inputEditDoc,
                        })
                    } else {
                        editMutation.mutate({
                            userAddress: address?.toString(),
                            claimTopic: claimTopic,
                            docgen: inputEditDoc,
                        })    
                    }
                    setInputEditDoc(null)
                }}>
                    Edit Claim Topic
                </Button>
            </Stack>
        </Flex>
    )
}