import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-origo-accent disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-origo-accent text-origo-black hover:bg-origo-accentHover":
              variant === "primary",
            "bg-origo-zinc text-origo-white hover:bg-origo-zinc/80":
              variant === "secondary",
            "border border-origo-zinc bg-transparent text-origo-white hover:bg-origo-zinc/50":
              variant === "outline",
            "text-origo-silver hover:bg-origo-zinc/30 hover:text-origo-white":
              variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
