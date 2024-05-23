import "./PageNavigation.css";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Container } from "@radix-ui/themes";
import { Link } from "react-router-dom";

// React Icons
import { FaArrowLeft, FaHeart } from "react-icons/fa6";
import { IoAddCircle } from "react-icons/io5";
import { TbRadioactiveFilled } from "react-icons/tb";
import { RiSettings3Fill } from "react-icons/ri";

function PageNavigation() {
  return (
    <Container>
      <NavigationMenu.Root className="pagenav__menubar">
        <NavigationMenu.List className="pagenav__ul-list-container">
          <NavigationMenu.Item className="pagenav__li">
            <NavigationMenu.Trigger className="pagenav__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/"}
                className="pagenav__back pagenav__li-btn-link"
              >
                <FaArrowLeft tabIndex={-1} size={18} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="pagenav__li">
            <NavigationMenu.Trigger className="pagenav__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={""}
                className="pagenav__add-post pagenav__li-btn-link"
              >
                <IoAddCircle tabIndex={-1} size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="pagenav__li">
            <NavigationMenu.Trigger className="pagenav__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/profile"}
                className="pagenav__favorites pagenav__li-btn-link"
              >
                <FaHeart size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="pagenav__li">
            <NavigationMenu.Trigger className="pagenav__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/profile"}
                className="pagenav__allergies pagenav__li-btn-link"
              >
                <TbRadioactiveFilled size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="pagenav__li">
            <NavigationMenu.Trigger className="pagenav__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/profile"}
                className="pagenav__settings pagenav__li-btn-link"
              >
                <RiSettings3Fill size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Container>
  );
}

export default PageNavigation;
