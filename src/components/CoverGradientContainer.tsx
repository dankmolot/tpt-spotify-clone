import type { ComponentPropsWithRef } from "react"
import { cn } from "@/lib/utils"
import classes from "./CoverGradientContainer.module.css"

export function CoverGradientContainer({
    className,
    ...props
}: ComponentPropsWithRef<"div">) {
    return <div className={cn(classes.coverGradient, className)} {...props} />
}
