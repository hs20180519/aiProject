import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import Btn from "./Btn";
import { InfoIcon } from "@chakra-ui/icons";

export default function CunfirmModal({ isOpen, onClose, message1, message2, onClick }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent color="teal">
        <ModalHeader>
          <InfoIcon mr={2} />
          {message1}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody color="black">{message2}</ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Btn text="취소" colorScheme="red" onClick={onClose} />
            <Btn text="확인" onClick={onClick} />
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
