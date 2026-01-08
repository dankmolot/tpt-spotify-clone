import { useEffect } from "react"
import type { AlbumID3 } from "@/lib/api/subsonic"
import { useGetCoverArt } from "@/lib/queries/subsonic"
import { cn } from "@/lib/utils"
import classes from "./Album.module.css"

export interface AlbumProps
    extends Omit<React.ComponentProps<"div">, "children"> {
    album: AlbumID3
}

export function Album({ album, className, ...props }: AlbumProps) {
    return (
        <div {...props} className={cn(classes.album, className)}>
            <CoverArt id={album.coverArt} />
            {album.name}
        </div>
    )
}

export interface ConverArtProps
    extends Omit<React.ComponentProps<"img">, "children"> {
    id?: string
}

export function CoverArt({ id, className, ...props }: ConverArtProps) {
    const { data, error } = useGetCoverArt(id ? { id: "test" } : undefined)

    useEffect(() => {
        if (!data) return
    }, [data])

    console.log(error)

    if (!id) {
        return (
            <span className={cn(classes.coverArt, className)} {...props}>
                missing cover
            </span>
        )
    }

    return (
        <img
            className={cn(classes.coverArt, className)}
            src="https://qodeinteractive.com/magazine/wp-content/uploads/2020/06/16-Tame-Impala.jpg"
            alt="Tame Impala"
            {...props}
        />
    )
}
