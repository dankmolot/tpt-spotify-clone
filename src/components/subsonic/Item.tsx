import type { ClassValue } from "clsx"
import type { ComponentPropsWithRef } from "react"
import type { Playlist } from "@/lib/api/subsonic/schemas"
import { cn } from "@/lib/utils"
import { RawLink } from "../custom/Link"
import { CoverArt } from "./CoverArt"
import classes from "./Item.module.css"

export interface ItemTheme {
    item?: ClassValue
    info?: ClassValue
    coverArt?: ClassValue
}

export interface ItemProps extends ComponentPropsWithRef<"div"> {
    theme?: ItemTheme
    coverID?: string
}

export function Item({
    className,
    children,
    theme,
    coverID,
    ...props
}: ItemProps) {
    return (
        <div className={cn(classes.item, theme?.item, className)} {...props}>
            {coverID && (
                <CoverArt
                    id={coverID}
                    className={cn(classes.coverArt, theme?.coverArt)}
                />
            )}
            <div className={cn(classes.info, theme?.info)}>{children}</div>
        </div>
    )
}

export interface PlaylistItemTheme {
    item?: ItemTheme
    link?: ClassValue
    title?: ClassValue
    owner?: ClassValue
}

export interface PlaylistItemProps extends ComponentPropsWithRef<"div"> {
    theme?: PlaylistItemTheme
    playlist: Playlist
}

export function PlaylistItem({ playlist, theme, ...props }: PlaylistItemProps) {
    return (
        <RawLink to="/playlist/$playlistID" params={{ playlistID: playlist.id }} className={cn(classes.link, theme?.link)}>
            <Item theme={theme?.item} coverID={playlist.coverArt ?? ""} {...props}>
                <span className={cn(classes.title, theme?.title)}>
                    {playlist.name}
                </span>
                {playlist.owner && <span className={cn(classes.description, theme?.owner)}>Playlist • {playlist.owner}</span>}
            </Item>
        </RawLink>
    )
}
