import { BoxProps, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

export interface LinkItemProps {
  id: string;
  name: string;
  icon: IconType;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
  onLogout: () => void;
  nickname: string;
}

export interface SidebarProps extends BoxProps {
  onClose: () => void;
}
