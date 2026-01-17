import type { ComponentPropsWithRef } from "react"
import { Link } from "@/components/custom/Link"
import type { AlbumID3 } from "@/lib/api/subsonic/schemas"
import { cn } from "@/lib/utils"
import classes from "./Album.module.css"
import { CoverArt } from "./CoverArt"

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
        <Link
            {...props}
            className={cn(classes.album, className)}
            to="/album/$albumID"
            params={{ albumID: album.id }}
        >
            <CoverArt id={album.coverArt} className={classes.coverArt} />
            <AlbumFooter album={album} />
        </Link>
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
