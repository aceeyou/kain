import { Flex, Spinner } from "@radix-ui/themes";

function Loading() {
  return (
    <Flex width="100" justify="center">
      <Spinner size="3" className="data__spinner" />
    </Flex>
  );
}

export default Loading;
