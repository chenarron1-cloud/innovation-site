import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-ind-bd bg-ind-bg text-ind",
        secondary: "border-bd bg-bg2 text-t2",
        success: "border-green-200 bg-green-50 text-grn-t",
        destructive: "border-red/20 bg-red/10 text-red",
        amber: "border-amber/20 bg-amber/10 text-amber",
        outline: "border-bd text-t1",
        gold: "border-yellow-300 bg-yellow-50 text-amber",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
