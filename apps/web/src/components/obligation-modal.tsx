import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useGetObligationByAssetAndSeller } from "../hooks/api/obligations/use-get-obligation";
import { CreateObligationBody } from "./create-obligation-body";

export const ObligationModal = ({ isOpen, onClose, tokenAddress, userAddress }: { isOpen: boolean, onClose: () => void, tokenAddress: string, userAddress: string }) => {
  const { isLoadingObligationByAsset, obligationByAssetData } = useGetObligationByAssetAndSeller(tokenAddress, userAddress)

  return <>
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Obligation</ModalHeader>
        <ModalCloseButton />
        {
          !isLoadingObligationByAsset 
            && <CreateObligationBody tokenAddress={tokenAddress} userAddress={userAddress} modalBody={obligationByAssetData}/>
        }
      </ModalContent>
    </Modal>
  </>
}