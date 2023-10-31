import { Box, Flex, Icon } from "@chakra-ui/react";
import * as type from "../../apis/types/main";

interface NavItemProps extends type.NavItemProps {
  active?: boolean;
}
export default function NavItem({ icon, children, active, ...rest }: NavItemProps) {
  return (
    <Box as={"a"} href={"#"} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        display={'flex'}
        align={"center"}
        p={"4"}
        mx={"4"}
        borderRadius={"lg"}
        role={"group"}
        cursor={"pointer"}
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={"4"}
            fontSize={"16"}
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}
