import { Link as RouterLink } from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import "./Link.css"

export const Link = RouterLink
export type LinkProps = ComponentPropsWithRef<typeof Link>
