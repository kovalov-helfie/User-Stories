import { Stack, Button, Checkbox } from "@chakra-ui/react";

export function UserComponent({userData}: {userData: any}) {
    return (
        <Stack direction={"row"} justifyContent={'space-between'} margin={'30px'}>
            <w3m-button />
            <Stack direction={'row'}>
                {
                    !userData?.identityAddress 
                    ?                 
                        <Button colorScheme='blue' size='sm'>
                            Deploy Identity
                        </Button>
                    : 
                        <Button disabled>
                            Identity {userData?.identityAddress}
                        </Button>
                }
                <Checkbox colorScheme='green' size='lg' isChecked={userData?.isVerified} disabled/>
            </Stack>
        </Stack>
    )
}