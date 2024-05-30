import { Button, Container, Flex, Heading, Spinner } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { FaArrowLeft } from "react-icons/fa6";

import "./Navigation.css";
import { useNavigate } from "react-router-dom";
interface NavigationProps {
  title: string;
  isLoading: boolean;
  handleRightButton: () => void;
}
function Navigation({ title, handleRightButton, isLoading }: NavigationProps) {
  const navigate = useNavigate();
  return (
    <Container className="navigation__container">
      <NavigationMenu.Root className="navigation__root">
        <Flex
          asChild
          direction="row"
          justify="between"
          align="center"
          className="navigation__flexbox"
        >
          <NavigationMenu.List className="navigation__list-ctn">
            <Button
              asChild
              tabIndex={1}
              size="1"
              className="navigation__item-btn"
              onClick={() => navigate(-1)}
            >
              <NavigationMenu.Item className="navigation__item">
                <FaArrowLeft size={18} />
              </NavigationMenu.Item>
            </Button>
            <Button
              asChild
              size="1"
              tabIndex={1}
              type="button"
              className="navigation__item-btn"
              onClick={handleRightButton}
            >
              <NavigationMenu.Item className="navigation__item">
                {isLoading ? <Spinner size="3" /> : "save"}
              </NavigationMenu.Item>
            </Button>
          </NavigationMenu.List>
        </Flex>
        <Heading className="navigation__title">{title}</Heading>
      </NavigationMenu.Root>
    </Container>
  );
}

export default Navigation;
