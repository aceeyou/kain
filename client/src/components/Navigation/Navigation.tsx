import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { FaArrowLeft } from "react-icons/fa6";

import "./Navigation.css";
import { useNavigate } from "react-router-dom";
interface Title {
  title: string;
}
function Navigation({ title }: Title) {
  const navigate = useNavigate();
  return (
    <Container className="navigation__container">
      <NavigationMenu.Root className="navigation__root">
        <NavigationMenu.List className="navigation__list-ctn">
          <Flex
            direction="row"
            justify="between"
            align="center"
            className="navigation__flexbox"
          >
            <NavigationMenu.Link
              asChild
              tabIndex={1}
              className="navigation__link"
              onClick={() => navigate(-1)}
            >
              <NavigationMenu.Item
                asChild
                tabIndex={-1}
                className="navigation__item"
              >
                <Flex align="center" justify="center">
                  <FaArrowLeft size={18} />
                </Flex>
              </NavigationMenu.Item>
            </NavigationMenu.Link>
            <NavigationMenu.Item asChild className="navigation__item">
              <Button
                size="1"
                tabIndex={1}
                type="button"
                className="navigation__item-btn"
              >
                save
              </Button>
            </NavigationMenu.Item>
          </Flex>
        </NavigationMenu.List>
        <Heading className="navigation__title">{title}</Heading>
      </NavigationMenu.Root>
    </Container>
  );
}

export default Navigation;
