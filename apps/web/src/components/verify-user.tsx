import { Button, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useDeleteIdentity } from "../hooks/identities/use-bc-delete-identity";
import { useRegisterIdentity } from "../hooks/identities/use-bc-register-identity";
import { useAddOperator } from "../hooks/users/use-bc-add-operator";
import { useRemoveOperator } from "../hooks/users/use-bc-remove-operator";
import { useVerifyUser } from "../hooks/users/use-verify-user";

export function VerifyUser({ country, isVerified, identityAddress, address, userAddress }:
    { country: string, isVerified: boolean, identityAddress: string, address: string, userAddress: string }) {
    const [inputCountry, setInputCountry] = useState(country);

    const verifyUserClaim = useVerifyUser()

    const useAddUser = useAddOperator()
    const registerIdentity = useRegisterIdentity()

    const useRemoveUser = useRemoveOperator()
    const deleteIdentity = useDeleteIdentity()

    return (
        <Stack direction={"column"}>
            {
                !country || !isVerified
                    ? <Input placeholder='Country' value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} />
                    : <></>
            }
            <Button isDisabled={!identityAddress} colorScheme={isVerified ? 'red' : 'green'} size='sm'
                onClick={async () => {
                    if (identityAddress) {
                        if (isVerified) {
                            await deleteIdentity.mutateAsync({ userAddress: userAddress })
                            await useRemoveUser.mutateAsync({ userAddress: userAddress })
                        } else {
                            await registerIdentity.mutateAsync({
                                userAddress: userAddress,
                                identityAddress: identityAddress,
                                country: Number(inputCountry),
                            })
                            await useAddUser.mutateAsync({ userAddress: userAddress })
                        }
                        await verifyUserClaim.mutateAsync({
                            senderAddress: address?.toString(),
                            userAddress: userAddress,
                            country: Number(inputCountry),
                            verify: isVerified ? false : true,
                        })
                    }
                }}>
                {isVerified ? 'Unverify' : 'Verify'}
            </Button>
        </Stack>
    )
}