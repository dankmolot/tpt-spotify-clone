import { useInView } from "react-intersection-observer"
import { useBlob } from "@/lib/hooks/utils"
import { useGetCoverArt } from "@/lib/queries/subsonic"
import classes from "./Album.module.css"

export interface IAlbum {
    name: string
    coverArt?: string
    artist?: string
}

export interface AlbumProps
    extends Omit<React.ComponentProps<"div">, "children" | "className"> {
    album: IAlbum
}

export function Album({ album, ...props }: AlbumProps) {
    return (
        <div {...props} className={classes.album}>
            <CoverArt id={album.coverArt} />
            <AlbumFooter album={album} />
        </div>
    )
}

export function AlbumFooter({ album, ...props }: AlbumProps) {
    return (
        <div className={classes.albumFooter} {...props}>
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
}

export function CoverArt({ id, ...props }: ConverArtProps) {
    const { ref, inView } = useInView()
    const { data, error } = useGetCoverArt(id ? { id, enabled: inView } : undefined)
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
