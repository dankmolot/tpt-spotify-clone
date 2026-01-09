import { createLink } from "@tanstack/react-router"
import { MenuItem, Link as RACLink } from "react-aria-components"
import "./Link.module.css"

export const Link = createLink(RACLink)
export const MenuItemLink = createLink(MenuItem)
