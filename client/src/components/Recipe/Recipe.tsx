import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import "./Recipe.css";
import { FaHeart } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";

// interface
interface PropTypes {
  recipe: {
    image?: string | null;
    recipe_name?: string | null;
    recipe_owner?: string | null;
  };
  handleClick: () => void;
}

function Recipe({ recipe, handleClick }: PropTypes) {
  return (
    <Card
      className="home__recipe-card"
      variant="ghost"
      asChild
      size="1"
      tabIndex={1}
      onClick={handleClick}
      onKeyDown={(key) => {
        if (key.key === "Enter") handleClick;
      }}
    >
      <Flex
        className="home__recipe-content"
        as="div"
        display="flex"
        direction="column"
        justify="between"
        style={{
          background: `url(${recipe.image})`,
        }}
      >
        <Button onClick={() => alert("hi")} className="home__recipe-save">
          <FiHeart size={21} />
        </Button>
        <Box>
          <Heading className="home__recipe-recipe-name">
            {recipe.recipe_name}
          </Heading>
          <Text className="home__recipe-owner">@{recipe.recipe_owner}</Text>
        </Box>
      </Flex>
    </Card>
  );
}

export default Recipe;
