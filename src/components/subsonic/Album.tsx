import { useQuery } from "@tanstack/react-query"
import type { ComponentPropsWithRef } from "react"
import { useInView } from "react-intersection-observer"
import { RawLink } from "@/components/aria/Link"
import type { AlbumID3 } from "@/lib/api/subsonic"
import { useBlob } from "@/lib/hooks/utils"
import { getCoverArtOptions } from "@/lib/queries/subsonic"
import { cn } from "@/lib/utils"
import classes from "./Album.module.css"

export interface IAlbum {
    id: string
    name: string
    coverArt?: string
    artist?: string
}

export interface AlbumProps
    extends Omit<ComponentPropsWithRef<"a">, "children" | "href"> {
    album: AlbumID3
}

export function Album({ album, className, ...props }: AlbumProps) {
    return (
        <RawLink
            {...props}
            className={cn(classes.album, className)}
            to="/album/$albumID"
            params={{ albumID: album.id }}
        >
            <CoverArt id={album.coverArt} />
            <AlbumFooter album={album} />
        </RawLink>
    )
}

export interface AlbumFooterProps
    extends Omit<ComponentPropsWithRef<"div">, "children"> {
    album: AlbumID3
}

export function AlbumFooter({ album, className, ...props }: AlbumFooterProps) {
    return (
        <div className={cn(classes.albumFooter, className)} {...props}>
            <AlbumName album={album} />
            <AlbumArtist album={album} />
        </div>
    )
}

export interface AlbumTextProps
    extends Omit<React.ComponentProps<"div">, "children" | "className"> {
    album: IAlbum
}

export function AlbumName({ album, ...props }: AlbumTextProps) {
    return (
        <span className={classes.albumName} {...props}>
            {album.name}
        </span>
    )
}

export function AlbumArtist({ album, ...props }: AlbumTextProps) {
    return (
        <span className={classes.albumArtist} {...props}>
            {album.artist}
        </span>
    )
}

export interface ConverArtProps
    extends Omit<React.ComponentProps<"img">, "children" | "className"> {
    id?: string
    size?: number
}

export function CoverArt({ id, size, ...props }: ConverArtProps) {
    const { ref, inView } = useInView()
    const { data, error } = useQuery({
        ...getCoverArtOptions({ id: id ?? "", size }),
        enabled: !!id && inView,
    })
    const coverURL = useBlob(data)

    if (!id || error) {
        return (
            <span className={classes.coverArt} {...props}>
                missing cover
            </span>
        )
    }
    return (
        <img
            className={classes.coverArt}
            src={coverURL}
            alt="Album Cover"
            ref={ref}
            {...props}
        />
    )
}
