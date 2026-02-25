import React from "react"
import type { AlbumID3, PlaylistWithSongs } from "@/lib/api/subsonic/schemas"
import { cn, humanDuration } from "@/lib/utils"
import { FirstArtist } from "./Artist"
import { CoverArt } from "./CoverArt"
import classes from "./Overview.module.css"

export interface OverviewProps extends React.ComponentPropsWithRef<"div"> {
    coverID: string
    type: "Album" | "Playlist"
    title: string
    onCoverLoaded?: (el: HTMLImageElement) => void
}

export function Overview({
    coverID,
    type,
    title,
    children,
    className,
    onCoverLoaded,
    ...props
}: OverviewProps) {
    const items = React.Children.map(children, (child, i) => [
        child,
        // biome-ignore lint/suspicious/noArrayIndexKey: there is no id here
        <span key={i}>•</span>,
    ])
        ?.flat()
        .slice(0, -1)

    return (
        <div className={cn(classes.overview, className)} {...props}>
            <CoverArt
                id={coverID}
                className={classes.coverArt}
                onLoad={(e) => onCoverLoaded?.(e.currentTarget)}
            />
            <div className={classes.info}>
                <span className={classes.type}>{type}</span>
                <span
                    className={classes.title}
                    style={
                        { "--text-length": title.length } as React.CSSProperties
                    }
                >
                    {title}
                </span>
                <div className={classes.items}>{items}</div>
            </div>
        </div>
    )
}

export interface AlbumOverviewProps
    extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
    album: AlbumID3
    onCoverLoaded?: (el: HTMLImageElement) => void
}

export function AlbumOverview({ album, ...props }: AlbumOverviewProps) {
    return (
        <Overview
            coverID={album.coverArt ?? ""}
            type="Album"
            title={album.name}
            {...props}
        >
            <FirstArtist from={album} withCover />

            {album.year && <span>{album.year}</span>}
            <span>{album.songCount} songs</span>
            {album.duration && <span>{humanDuration(album.duration)}</span>}
        </Overview>
    )
}

export interface PlaylistOverviewProps
    extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
    playlist: PlaylistWithSongs
    onCoverLoaded?: (el: HTMLImageElement) => void
}

export function PlaylistOverview({
    playlist,
    ...props
}: PlaylistOverviewProps) {
    return (
        <Overview
            coverID={playlist.coverArt ?? ""}
            type="Playlist"
            title={playlist.name}
            {...props}
        ></Overview>
    )
}
