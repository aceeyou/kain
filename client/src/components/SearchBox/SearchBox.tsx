import { useState } from "react";
import "./SearchBox.css";

// Radix
import { Box, Section, Heading } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

// reacts-icons
import { IoSearch } from "react-icons/io5";

function SearchBox({ handleOnSubmit }: any) {
  const [search, setSearch] = useState("");

  return (
    <Box asChild>
      <Section className="home__search-section">
        <Heading as="h3" size="2" trim="both" className="home__greetings">
          Good Morning! What's cookin'?
        </Heading>
        <Box className="home__search-container">
          <Form.Root className="home__search-form">
            <Form.Field name="search" className="home__search-input-container">
              <Form.Control asChild>
                <input
                  className="home__search-input"
                  type="text"
                  name="search"
                  placeholder="Search for the best recipes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Control>
              <Form.Submit
                className="home__search-btn-container"
                onClick={handleOnSubmit}
              >
                <IoSearch />
              </Form.Submit>
            </Form.Field>
          </Form.Root>
        </Box>
      </Section>
    </Box>
  );
}

export default SearchBox;
