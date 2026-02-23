import { createLink, Link as RouterLink } from "@tanstack/react-router"
import {
    type AnchorHTMLAttributes,
    type ComponentPropsWithRef,
    forwardRef,
} from "react"
import "./Link.css"
import { cn } from "@/lib/utils"

export const RawLink = RouterLink
export type RawLinkProps = ComponentPropsWithRef<typeof RawLink>

// https://tanstack.com/router/latest/docs/guide/custom-link#basic-example
interface DecoratedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const DecoratedLink = forwardRef<HTMLAnchorElement, DecoratedLinkProps>(
    (props, ref) => (
        <a ref={ref} {...props} className={cn("link", props.className)} />
    ),
)

export const Link = createLink(DecoratedLink)
export type LinkProps = ComponentPropsWithRef<typeof Link>
