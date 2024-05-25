import { Avatar, Box, Flex, Skeleton, Text } from "@radix-ui/themes";

function LoadingProfileHeader() {
  return (
    <>
      <Box>
        <Flex>
          <Skeleton ml="3">
            <Avatar size="6" fallback="kain" radius="full" />
          </Skeleton>
          <Box ml="7">
            <Box>
              <Skeleton width="130px" height="25px" mt="2" />
              <Flex gap="9">
                <Skeleton
                  width="100px"
                  height="15px"
                  mt="1"
                  style={{ borderRadius: "16px" }}
                />
                <Skeleton width="80px" height="20px" />
              </Flex>
              <Flex gap="2">
                <Skeleton width="50px" height="15px" mt="1" />
                <Skeleton width="60px" height="15px" mt="1" />
              </Flex>
            </Box>
          </Box>
        </Flex>
        <Text />
      </Box>
      <Box mt="5" mb="6" pl="3">
        <Text>
          <Skeleton>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque felis tellus, efficitur id convallis a, libero. Nam
            magna erat, fringilla sed.
          </Skeleton>
        </Text>
      </Box>
    </>
  );
}

export default LoadingProfileHeader;
