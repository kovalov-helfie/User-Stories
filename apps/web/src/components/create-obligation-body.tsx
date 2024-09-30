import { Button, Stack, Input, ModalBody, FormControl, FormLabel } from "@chakra-ui/react"
import { useState } from "react";
import { useCreateObligation } from "../hooks/obligations/use-create-obligation";
import { isAddress } from 'viem'

export const CreateObligationBody = ({ assetId, userAddress, modalBody }: { assetId:number, userAddress: string, modalBody: any }) => {
  const [inputMinAmount, setInputMinAmount] = useState(modalBody?.minPurchaseAmount ?? 0);
  const [inputLockup, setInputLockup] = useState(modalBody?.lockupPeriod ?? 0);
  const [inputRestrict, setInputRestrict] = useState(modalBody?.transferRestrictionAddress ?? '');

  const createObligationMutation = useCreateObligation()

  return <>
        <ModalBody>
          <Stack spacing={3} w={'100%'}>
            <FormControl>
              <FormLabel>Min purchase Amount</FormLabel>
              <Input placeholder='Min purchase Amount' value={inputMinAmount} onChange={(e) => setInputMinAmount(Number(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Lock up time in secs</FormLabel>
              <Input placeholder='Lock up time in secs' value={inputLockup} onChange={(e) => setInputLockup(Number(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Transfer restriction address</FormLabel>
              <Input placeholder='Transfer restriction address' value={inputRestrict} onChange={(e) => {
                if (e.target.value !== '') {
                  if (isAddress(e.target.value)) {
                    setInputRestrict(e.target.value)
                  }
                }
                setInputRestrict(e.target.value)
              }} />
            </FormControl>
            <Button colorScheme='blue' onClick={() => {
              createObligationMutation.mutate({
                assetId: assetId,
                userAddress: userAddress,
                minPurchaseAmount: inputMinAmount,
                lockupPeriod: inputLockup,
                transferRestrictionAddress: inputRestrict,
              })
            }}>
              { !modalBody ? 'Create ' : 'Edit '}
              Obligation for Asset[{assetId}]
            </Button>
          </Stack>
        </ModalBody>
  </>
}