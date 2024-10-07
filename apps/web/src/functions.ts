import { toBytes, keccak256, encodeAbiParameters, parseAbiParameters, Address, SignableMessage } from 'viem'

export const verifyMessage = (address: string, methodStr: string) => {
    return `You [${address}] are going to sign this message for method [${methodStr}]`
}

export const claimSignature = (
    identityHolder: Address,
    claimTopic: bigint,
    data: `0x${string}`,
): SignableMessage => {
    const sign =
        keccak256(
            encodeAbiParameters(
                parseAbiParameters('address, uint256, bytes'),
                [identityHolder, claimTopic, data],
            ),
        );
    return sign;
};

export const generateClaimId = (
    identityHolder: Address,
    claimTopic: bigint,
): string => {
    const claimid =
        keccak256(
            encodeAbiParameters(
                parseAbiParameters('address, uint256'),
                [identityHolder, claimTopic],
            ),
        );
    return claimid;
};