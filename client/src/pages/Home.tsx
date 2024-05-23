import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Home.css";

// react icons
import { RiShoppingBasket2Fill } from "react-icons/ri";
// import { RiShoppingBasket2Line } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
// import { FaRegHeart } from "react-icons/fa";

// Radix
import {
  Container,
  Badge,
  ScrollArea,
  Button,
  Flex,
  Heading,
  Box,
  Grid,
} from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Avatar from "@radix-ui/react-avatar";
// import * as ScrollArea from "@radix-ui/react-scroll-area";

// Components
import Logo from "../components/Logo";
import SearchBox from "../components/SearchBox/SearchBox";
import Recipe from "../components/Recipe/Recipe";

// types
type OnSubmitHandler = (e: React.FormEvent<HTMLInputElement>) => void;

// Dummy Data
const list = [
  "All",
  "Burger",
  "Pie",
  "Ice Cream",
  "Pasta",
  "Bread",
  "Shake",
  "Milktea",
  "Milkshake",
];

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [user, setUser] = useState({
    id: "",
    username: "",
    fullname: "",
    profilePicture: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // LATER CHANGE TO FETCH USER DATA AND RECIPES
    async function verifyToken() {
      await axios
        .get("http://127.0.0.1:8080/profile", {
          withCredentials: true,
        })
        .then((data: any) => {
          setUser({ ...data.data });
        })
        .catch((err) => {
          console.log(err);
          navigate("/login");
        });
    }

    async function getRecipes() {
      try {
        await axios
          .get("http://127.0.0.1:8080/recipes", { withCredentials: true })
          .then((res) => {
            setRecipes(res.data);
          });
      } catch (error: any) {
        console.log(error.message);
      }
    }

    verifyToken();
    getRecipes();
  }, [navigate]);

  const handleOnSubmit: OnSubmitHandler = (e) => {
    e.preventDefault();
    console.log("hi");
  };
  return (
    <Container size="1" align="center" className="home__container">
      <NavigationMenu.Root className="home__menubar">
        <Logo
          align="left"
          size="6"
          style={{ marginRight: "auto", letterSpacing: "-3px" }}
          className=""
        />
        <NavigationMenu.List className="home__ul-list-container">
          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={""}
                className="home__shopping-bag home__li-btn-link"
              >
                <Badge
                  size="1"
                  color="orange"
                  variant="solid"
                  radius="full"
                  tabIndex={-1}
                  className="home__badge"
                >
                  2
                </Badge>
                <RiShoppingBasket2Fill tabIndex={-1} size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={""}
                className="home__favorites home__li-btn-link"
              >
                <FaHeart tabIndex={-1} size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/profile"}
                className="home__avatar home__li-btn-link"
              >
                <Avatar.Root>
                  <Avatar.Image
                    className="home__avatar-img"
                    src={`${user?.profilePicture}`}
                    alt={`${user?.username} Picture`}
                  />
                  <Avatar.Fallback
                    className="home__avatar-fallback"
                    delayMs={500}
                  >
                    {user?.fullname[0]?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      {/* Search bar */}
      <SearchBox handleOnSubmit={handleOnSubmit} />
      {/* <ScrollArea.Root>
        <ScrollArea.Viewport>
          {list.map((item, index) => (
            <Button variant="soft" key={index}>
              {item}
            </Button>
          ))}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root> */}
      <ScrollArea
        className="home__scrollable"
        type="auto"
        scrollbars="horizontal"
        size="1"
        style={{ paddingBottom: "15px" }}
      >
        <Flex direction="row">
          {list.map((item, index) => (
            <Button
              className={`home__scrollable-btn-item ${
                activeCategory === item ? "home__active-category" : ""
              }`}
              variant="soft"
              key={index}
              onClick={() => setActiveCategory(item)}
            >
              {item}
            </Button>
          ))}
        </Flex>
      </ScrollArea>

      <Heading as="h2" size="3" className="home__recipe-heading">
        Popular
      </Heading>
      <ScrollArea
        className="home__popular-recipes-container"
        type="auto"
        scrollbars="horizontal"
        size="1"
        style={{ paddingBottom: "15px" }}
      >
        <Flex gap="2" direction="row" className="home__popular-recipes">
          {!!recipes &&
            recipes.map((recipe: any, index: number) => (
              <Recipe key={index} recipe={recipe} />
            ))}
        </Flex>
      </ScrollArea>

      <Heading as="h2" size="3" className="home__recipe-heading">
        Recipes
      </Heading>
      <Grid columns="2" gap="2" className="home__discover-recipes">
        {!!recipes &&
          recipes.map((recipe: any, index: number) => (
            <Recipe key={index} recipe={recipe} />
          ))}
      </Grid>
    </Container>
  );
}

export default Home;
