import { type LinkComponent, Link as RouterLink } from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import "./Link.css"
import { cn } from "@/lib/utils"

export const RawLink = RouterLink
export type RawLinkProps = ComponentPropsWithRef<typeof RawLink>

export const Link: LinkComponent<typeof HTMLAnchorElement> = (props) => {
    return <RawLink {...props} className={cn("link", props.className)} />
}
export type LinkProps = ComponentPropsWithRef<typeof Link>
