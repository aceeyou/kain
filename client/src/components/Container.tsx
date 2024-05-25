import { Container as Ctn } from "@radix-ui/themes";

function Container({ children }: any) {
  return <Ctn style={styles.ctn}>{children}</Ctn>;
}

const styles = {
  ctn: {
    maxWidth: "var(--max-width)",
    minWidth: "var(--min-width)",
    marginInline: "auto",
  },
};

export default Container;
