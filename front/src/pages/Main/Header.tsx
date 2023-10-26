import { Drawer, DrawerContent } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";

export default function Header({ isOpen, onClose }) {
  return (
    <>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer
        isOpen={isOpen}
        placement={"left"}
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size={"full"}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
