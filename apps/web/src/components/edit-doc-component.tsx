import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useEditUserClaim } from "../hooks/claims/use-edit-user-claim";

export function EditDocComponent({ address, claimTopic }: { address: string, claimTopic: string }) {
    const [inputEditDoc, setInputEditDoc] = useState<File | null>(null);
    const editMutation = useEditUserClaim()

    return (
        <Flex w={'100%'} justifyContent={'center'}>
            <Stack spacing={3} w={'100%'} direction={'row'} maxW={'2xl'}>
                <Input placeholder='Document' type="file" w={'50%'} onChange={(e) => { if (e.target.files) { setInputEditDoc(e.target.files[0]); } }} />
                <Button colorScheme='yellow' size={'m'} w={'50%'} onClick={() => {
                    editMutation.mutate({
                        userAddress: address?.toString(),
                        claimTopic: claimTopic,
                        docgen: inputEditDoc,
                    })
                    setInputEditDoc(null)
                }}>
                    Edit Claim Topic
                </Button>
            </Stack>
        </Flex>
    )
}