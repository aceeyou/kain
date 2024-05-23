import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";

// import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import "./Recipe.css";

interface PropType {
  owner: boolean;
  recipe: {
    recipe_name: string;
    image: string;
    cooking_time: number;
  };
  handleOnClick: () => void;
}

function Recipe({ recipe, handleOnClick, owner = false }: PropType) {
  const handleFavBtnClick = () => {
    alert("hi");
    return;
  };
  return (
    <Box
      className="recipe__container"
      style={{
        background: `url(${recipe.image})`,
      }}
    >
      {owner ? (
        <Text className="recipe__fav-btn time">{recipe?.cooking_time} min</Text>
      ) : (
        <Button onClick={handleFavBtnClick} className="recipe__fav-btn">
          <FaRegHeart size={18} />
        </Button>
      )}
      <Card
        className="recipe__card"
        variant="ghost"
        style={{ height: "100%" }}
        onClick={handleOnClick}
      >
        <Flex as="div" direction="column" className="recipe__description">
          <Text as="p" className="recipe__recipe-name">
            {recipe.recipe_name}
          </Text>
          {!owner && (
            <Text as="p" className="recipe__recipe-owner">
              @{recipe.recipe_name}
            </Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
}

export default Recipe;
