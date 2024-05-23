import { Heading } from "@radix-ui/themes";

interface PropType {
  style: any;
  size?: string | any;
  className: string;
  align?: string | any;
}

function Logo({ size, style, className, align }: PropType) {
  return (
    <Heading
      color="orange"
      size={size}
      style={{
        color: "var(--accent)",
        letterSpacing: "-5px",
        fontFamily: "Krona One, serif",
        ...style,
      }}
      className={className}
      align={align}
    >
      kain
    </Heading>
  );
}

export default Logo;
