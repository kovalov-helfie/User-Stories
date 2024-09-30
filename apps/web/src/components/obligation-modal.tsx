import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useGetObligationByAsset } from "../hooks/obligations/use-get-obligation";
import { CreateObligationBody } from "./create-obligation-body";

export const ObligationModal = ({ isOpen, onClose, assetId, userAddress }: { isOpen: boolean, onClose: () => void, assetId: number, userAddress: string }) => {
  const { isLoadingObligationByAsset, obligationByAssetData } = useGetObligationByAsset(assetId)

  return <>
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Obligation</ModalHeader>
        <ModalCloseButton />
        {
          !isLoadingObligationByAsset 
            && <CreateObligationBody assetId={assetId} userAddress={userAddress} modalBody={obligationByAssetData}></CreateObligationBody>
        }
      </ModalContent>
    </Modal>
  </>
}