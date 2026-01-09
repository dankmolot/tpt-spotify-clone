import { createLink, Link as RouterLink } from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import {
    MenuItem,
    Link as RACLink,
    type LinkProps as RACLinkProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"
import "./Link.css"

export const RawLink = RouterLink
export type RawLinkProps = ComponentPropsWithRef<typeof RawLink>

export const Link = createLink((props: RACLinkProps) => (
    <RACLink {...props} className={cn("react-aria-Link", props.className)} />
))
export type LinkProps = ComponentPropsWithRef<typeof Link>

export const MenuItemLink = createLink(MenuItem)
export type MenuItemLinkProps = ComponentPropsWithRef<typeof MenuItemLink>
