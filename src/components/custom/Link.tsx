import { Link as RouterLink } from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import "./Link.css"
import { cn } from "@/lib/utils"

export const RawLink = RouterLink
export type RawLinkProps = ComponentPropsWithRef<typeof RawLink>

export function Link({ className, ...props }: RawLinkProps) {
    return <RawLink className={cn("link", className)} {...props} />
}
export type LinkProps = ComponentPropsWithRef<typeof Link>
