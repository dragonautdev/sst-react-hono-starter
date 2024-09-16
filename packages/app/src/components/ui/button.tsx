import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50  ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90 text-base",
        secondary:
          "bg-white hover:bg-gold hover:text-white text-[#121212] text-lg shadow-sm",
        ghost: "hover:bg-primary hover:text-white border-[1px] ",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-primary shadow-sm hover:bg-primary hover:text-white text-base",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 md:py-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs py-3 text-base",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export default Button;

export type ButtonVariant = React.ComponentProps<typeof buttonVariants>;
export { buttonVariants };
