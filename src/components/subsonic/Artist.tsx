import type { ClassValue } from "clsx"
import type { ComponentPropsWithRef } from "react"
import type { ArtistID3 } from "@/lib/api/subsonic/schemas"
import { cn } from "@/lib/utils"
import { ArtistLink } from "../custom/Link"
import { Separator } from "../custom/Separator"
import classes from "./Artist.module.css"
import { CoverArt } from "./CoverArt"

export interface ArtistTheme {
    link?: ClassValue
    coverArt?: ClassValue
    name?: ClassValue
}

export interface ArtistProps
    extends Omit<ComponentPropsWithRef<"a">, "children"> {
    id?: string
    name: string
    coverID?: string
    theme?: ArtistTheme
}

export function Artist({
    id,
    name,
    coverID,
    className,
    theme,
    ...props
}: ArtistProps) {
    return (
        <ArtistLink
            artistID={id}
            className={cn(classes.author, theme?.link, className)}
            {...props}
        >
            {coverID && (
                <CoverArt
                    id={coverID}
                    className={cn(classes.coverArt, theme?.link)}
                />
            )}
            <span className={cn(theme?.name)}>{name}</span>
        </ArtistLink>
    )
}

/** Represents a subsonic object with artists */
export interface WithArtists {
    artist?: string
    artistId?: string
    artists?: ArtistID3[]
}

export interface ArtistsProps
    extends Omit<ComponentPropsWithRef<"a">, "children"> {
    theme?: ArtistTheme
    from: WithArtists
}

export function Artists({
    from: { artist, artistId, artists },
    theme,
    ...props
}: ArtistsProps) {
    // fallback method for old subsonic servers
    if (!artists) {
        if (!artist) artist = "Unknown"

        return <Artist id={artistId} name={artist} theme={theme} {...props} />
    }

    return (
        <span {...props}>
            {artists
                .flatMap((a) => [
                    <Artist key={a.id} id={a.id} name={a.name} theme={theme} />,
                    <Separator key={a.id} />,
                ])
                .slice(0, -1)}
        </span>
    )
}
