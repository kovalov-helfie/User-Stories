import { Button, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useDeleteIdentity } from "../hooks/blockchain/identities/use-bc-delete-identity";
import { useRegisterIdentity } from "../hooks/blockchain/identities/use-bc-register-identity";
import { useAddOperator } from "../hooks/blockchain/users/use-bc-add-operator";
import { useRemoveOperator } from "../hooks/blockchain/users/use-bc-remove-operator";
import { useVerifyUser } from "../hooks/api/users/use-verify-user";
import { useAllUserClaimsVerified } from "../hooks/api/claims/use-get-all-user-claims-verified";

export function VerifyUser({ country, isVerified, identityAddress, address, userAddress }:
    { country: string, isVerified: boolean, identityAddress: string, address: string, userAddress: string }) {
    const [inputCountry, setInputCountry] = useState(country);

    const { isPendingVer, allUserClaimsVerified } = useAllUserClaimsVerified(userAddress);

    const verifyUser = useVerifyUser()

    const useAddUser = useAddOperator()
    const registerIdentity = useRegisterIdentity()

    const useRemoveUser = useRemoveOperator()
    const deleteIdentity = useDeleteIdentity()

    return (
        <Stack direction={"column"}>
            {
                !isVerified
                    ? <Input placeholder='Country' value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} />
                    : <></>
            }
            <Button isDisabled={!identityAddress || !allUserClaimsVerified} colorScheme={isVerified ? 'red' : 'green'} size='sm'
                onClick={async () => {
                    if (identityAddress && allUserClaimsVerified) {
                        if (isVerified) {
                            await deleteIdentity.mutateAsync({ address: userAddress })
                            await useRemoveUser.mutateAsync({ userAddress: userAddress })
                        } else {
                            await registerIdentity.mutateAsync({
                                address: userAddress,
                                identityAddress: identityAddress,
                                country: Number(inputCountry),
                            })
                            await useAddUser.mutateAsync({ userAddress: userAddress })
                        }
                        await verifyUser.mutateAsync({
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