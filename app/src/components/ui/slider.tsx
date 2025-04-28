
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full overflow-hidden rounded-full bg-[darkgrey]/50">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#FF8133] to-[#FFA500]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border border-[#FF8133]/20 bg-[#FF8133] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF8133] focus-visible:ring-offset-1 hover:bg-[#FF8133]/90 hover:scale-110 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
