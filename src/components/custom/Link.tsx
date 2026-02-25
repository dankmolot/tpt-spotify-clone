import { createLink, Link as RouterLink } from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import "./Link.css"
import { cn } from "@/lib/utils"

export const RawLink = RouterLink
export type RawLinkProps = ComponentPropsWithRef<typeof RawLink>

// https://tanstack.com/router/latest/docs/guide/custom-link#basic-example
interface DecoratedLinkProps extends ComponentPropsWithRef<"a"> {
    raw?: boolean
}

function DecoratedLink({ raw, ...props }: DecoratedLinkProps) {
    if (raw) return <a {...props} />
    return <a {...props} className={cn("link", props.className)} />
}

export const Link = createLink(DecoratedLink)
export type LinkProps = ComponentPropsWithRef<typeof Link>

export type NotLinkProps = DecoratedLinkProps
export function NotLink({ raw, ...props }: NotLinkProps) {
    if (raw) return <span {...props} />
    return <span {...props} className={cn("link", props.className)} />
}

export interface WrappedLinkProps
    extends NotLinkProps,
        Pick<LinkProps, "preload"> {}

export interface AlbumLinkProps extends WrappedLinkProps {
    albumID?: string
}

export function AlbumLink({ albumID, ...props }: AlbumLinkProps) {
    if (!albumID) return <span {...props} />
    return <Link {...props} to="/album/$albumID" params={{ albumID }} />
}

export interface ArtistLinkProps extends WrappedLinkProps {
    artistID?: string
}

export function ArtistLink({ artistID, ...props }: ArtistLinkProps) {
    if (!artistID) return <span {...props} />
    return <Link {...props} to="/artist/$artistID" params={{ artistID }} />
}

export interface PlaylistLink extends WrappedLinkProps {
    playlistID?: string
}

export function PlaylistLink({ playlistID, ...props }: PlaylistLink) {
    if (!playlistID) return <span {...props} />
    return (
        <Link {...props} to="/playlist/$playlistID" params={{ playlistID }} />
    )
}
