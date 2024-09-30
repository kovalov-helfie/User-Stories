import { Stack, Button, Checkbox } from "@chakra-ui/react";
import { Web3Button } from "./web3-button";

export function UserComponent({userData}: {userData: any}) {
    return (
        <Stack direction={"row"} justifyContent={'space-between'} margin={'30px'}>
            <Web3Button/>
            <Stack direction={'row'}>
                {
                    <Button disabled>
                        Identity {userData?.identityAddress}
                    </Button>
                }
                <Checkbox colorScheme='green' size='lg' isChecked={userData?.isVerified} disabled/>
            </Stack>
        </Stack>
    )
}