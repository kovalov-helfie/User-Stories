import { Button, Stack, Input, ModalBody, FormControl, FormLabel } from "@chakra-ui/react"
import { useState } from "react";
import { useCreateObligation } from "../hooks/api/obligations/use-create-obligation";

export const CreateObligationBody = ({ tokenAddress, userAddress, modalBody }: { tokenAddress: string, userAddress: string, modalBody: any }) => {
  const [inputAmount, setInputAmount] = useState(modalBody?.amount ?? 0);
  const [inputTxCount, setInputLockup] = useState(modalBody?.txCount ?? 0);

  const createObligationMutation = useCreateObligation()

  return <>
    <ModalBody>
      <Stack spacing={3} w={'100%'}>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <Input placeholder='Amount' value={inputAmount} onChange={(e) => setInputAmount(Number(e.target.value))} />
        </FormControl>
        <FormControl>
          <FormLabel>Tx Count</FormLabel>
          <Input placeholder='Tx Count' value={inputTxCount} onChange={(e) => setInputLockup(Number(e.target.value))} />
        </FormControl>
        <Button colorScheme='blue' onClick={() => {
          createObligationMutation.mutate({
            tokenAddress: tokenAddress,
            userAddress: userAddress,
            amount: inputAmount,
            txCount: inputTxCount,
            obligationId: !modalBody?.obligationId ? null : modalBody?.obligationId 
          })
        }}>
          {!modalBody?.obligationId ? 'Create' : 'Edit'} for Asset[{tokenAddress.slice(0, 7)}]
        </Button>
      </Stack>
    </ModalBody>
  </>
}