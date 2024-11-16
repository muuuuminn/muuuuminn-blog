import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export const MenuIconButton = () => {
  return (
    <IconButton color="red" highContrast radius="full" variant="outline">
      <HamburgerMenuIcon width={24} height={24} />
    </IconButton>
  );
};
