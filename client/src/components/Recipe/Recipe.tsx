import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import "./Recipe.css";

// interface
interface PropTypes {
  recipe: {
    image?: string | null;
    recipe_name?: string | null;
    cooking_time: number;
    cooking_unit: string;
  };
  handleClick: () => void;
}

function RecipeProfile({ recipe, handleClick }: PropTypes) {
  return (
    <Card
      className="recipeprofile__card"
      variant="ghost"
      asChild
      size="3"
      tabIndex={1}
      onClick={handleClick}
      onKeyDown={(key) => {
        if (key.key === "Enter") handleClick;
      }}
    >
      <Flex
        className="recipeprofile__content"
        as="div"
        display="flex"
        direction="column"
        justify="between"
        style={{
          background: `url(${recipe.image})`,
        }}
      >
        <Text className="recipeprofile__time">
          {recipe.cooking_time} {recipe.cooking_unit}
        </Text>
        <Heading className="recipeprofile__recipe-name">
          {recipe.recipe_name}
        </Heading>
      </Flex>
    </Card>
  );
}

export default RecipeProfile;
