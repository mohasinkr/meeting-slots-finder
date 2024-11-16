import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const typographyVariants = cva("", {
  variants: {
    variant: {
      heading:
        "text-xl text-center",
      sm:
        "text-sm text-center",
    },
    color: {
      white: "text-white",
      black: "text-black",
      purple: "text-brand-purple",
    },
  },
  defaultVariants: {
    variant: "heading",
    color: "black",
  },
});

export type TypographyProps = VariantProps<typeof typographyVariants> &
  React.ComponentProps<"div"> & {
    children: React.ReactNode;
    className?: string;
    as?: JSX.ElementType;
  };

const Typography = ({
  children,
  className,
  variant,
  as,
  color,
  ...props
}: TypographyProps) => {
  const Comp = as || "p";
  return (
    <Comp
      className={cn(typographyVariants({ variant, color, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Typography;
