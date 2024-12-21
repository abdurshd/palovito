import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { buttonVariants } from "../../lib/button-variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  styleType?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, styleType, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const styleClass = styleType === 'green' 
      ? 'hover:bg-green-100 hover:border-2 hover:border-green-500 transition-all duration-300'
      : styleType === 'red'
      ? 'hover:bg-red-100 hover:border-2 hover:border-red-500 transition-all duration-300'
      : '';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), styleClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
