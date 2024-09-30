import { Button, Checkbox, Text, Stack, Table, Input, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, FormControl, FormLabel } from "@chakra-ui/react"
import { useState } from "react";
import { useCreateObligation } from "../hooks/obligations/use-create-obligation";
import { useGetObligationByAsset } from "../hooks/obligations/use-get-obligation";
import { isAddress } from 'viem'

export const ObligationModal = ({ isOpen, onClose, assetId, userAddress }: { isOpen: boolean, onClose: () => void, assetId: number, userAddress: string }) => {
  // TODO: obligationByAssetData === null ???
  // TODO: onClick for modals in Map

  const { isPendingObligationByAsset, obligationByAssetData } = useGetObligationByAsset(assetId)

  const [inputMinAmount, setInputMinAmount] = useState(obligationByAssetData?.minPurchaseAmount ?? 0);
  const [inputLockup, setInputLockup] = useState(obligationByAssetData?.lockupPeriod ?? 0);
  const [inputRestrict, setInputRestrict] = useState(obligationByAssetData?.transferRestrictionAddress ?? '');

  const createObligationMutation = useCreateObligation()

  return <>
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Obligation</ModalHeader>
        <ModalCloseButton />
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
              { !obligationByAssetData ? 'Create ' : 'Edit '}
              Obligation for Asset[{assetId}]
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}