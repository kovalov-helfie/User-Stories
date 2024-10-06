import { useReadContract } from "wagmi"
import { IDENTITY_FACTORY } from "../../addresses"
import { ID_FACTORY_ABI } from "../../abis/identity-factory.abi"
import { zeroAddress } from "viem";

export const useGetUserIdentity = (userAddress: string | undefined) => {
    const result = useReadContract({
        abi: ID_FACTORY_ABI,
        address: IDENTITY_FACTORY,
        functionName: 'getIdentity',
        args: [userAddress],
    })
    const resultData = result?.data
    if(resultData === zeroAddress) {
        return {identityAddress: '' }
    } else {
        return {identityAddress: resultData }
    }
}