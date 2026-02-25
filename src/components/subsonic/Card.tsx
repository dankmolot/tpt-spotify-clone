import type { ClassValue } from "clsx"
import type { ComponentPropsWithRef } from "react"
import type { AlbumID3 } from "@/lib/api/subsonic/schemas"
import { cn, toTitleCase } from "@/lib/utils"
import { AlbumLink, NotLink } from "../custom/Link"
import { Separator } from "../custom/Separator"
import { Artists } from "./Artist"
import classes from "./Card.module.css"
import { CoverArt } from "./CoverArt"

export interface CardTheme {
    card?: ClassValue
    info?: ClassValue
    coverArt?: ClassValue
}

export interface CardProps extends ComponentPropsWithRef<"div"> {
    theme?: CardTheme
    coverID?: string
}

export function Card({
    className,
    children,
    theme,
    coverID,
    ...props
}: CardProps) {
    return (
        <div className={cn(classes.card, theme?.card, className)} {...props}>
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

export interface AlbumCardTheme {
    card?: CardTheme
    link?: ClassValue
    title?: ClassValue
    artists?: ClassValue
    alternative?: ClassValue
}

export interface AlbumCardProps extends ComponentPropsWithRef<"div"> {
    theme?: AlbumCardTheme
    album: AlbumID3
    alternative?: boolean
}

export function AlbumCard({
    album,
    theme,
    alternative,
    ...props
}: AlbumCardProps) {
    const releaseType = album.releaseTypes?.[0]?.toLowerCase()

    return (
        <AlbumLink
            raw
            albumID={album.id}
            className={cn(classes.link, theme?.link)}
        >
            <Card theme={theme?.card} coverID={album.coverArt ?? ""} {...props}>
                <NotLink className={cn(classes.title, theme?.title)}>
                    {album.name}
                </NotLink>

                {alternative ? (
                    <span
                        className={cn(classes.description, theme?.alternative)}
                    >
                        {releaseType && (
                            <span>
                                {toTitleCase(releaseType)} <Separator />
                            </span>
                        )}
                        <span>{album.year || "lol"}</span>
                    </span>
                ) : (
                    <Artists
                        from={album}
                        className={cn(classes.description, theme?.artists)}
                    />
                )}
            </Card>
        </AlbumLink>
    )
}
