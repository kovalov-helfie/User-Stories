import { Td } from "@chakra-ui/react"
import { useBcGetBuyerPrice } from "../hooks/blockchain/dvd-transfers/use-bc-get-buyer-price"
import { zeroAddress } from "viem"

export const BuyerPrice = ({ sellerToken, sellAmount }: { sellerToken:string | undefined, sellAmount: number | undefined }) => {
    const { buyerPriceData } = useBcGetBuyerPrice(sellerToken ?? zeroAddress, sellAmount ?? 0)

    return <Td>
        {buyerPriceData?.toString()}
    </Td>
}