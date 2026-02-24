import { useQuery } from "@tanstack/react-query"
import { HeartIcon } from "lucide-react"
import {
    getSongOptions,
    useMutateStar,
    useMutateUnstar,
} from "@/lib/queries/subsonic"
import { cn } from "@/lib/utils"
import { SongItem, type SongItemProps } from "./Item"
import classes from "./Song.module.css"

export interface SongParams {
    /** Song ID */
    id: string
    /** Whenever to fetch song data, by default Song component will expect that the data was populated by other components */
    online?: boolean
}

export type SongProps = Omit<SongItemProps, "song"> & SongParams

export function Song({ id, online, ...props }: SongProps) {
    const { data: song } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: ({ title, coverArt, albumId, artist, artistId, artists }) => ({
            title,
            coverArt,
            albumId,
            artist,
            artistId,
            artists,
        }),
    })

    if (!song) return

    return <SongItem {...props} song={song} />
}

export function FavoriteSong({ id, online = false }: SongParams) {
    const { data: starred, isPending: songIsPending } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: (song) => !!song.starred,
    })

    const star = useMutateStar()
    const unstar = useMutateUnstar()

    function onClick() {
        if (starred) {
            unstar.mutate({ id })
        } else {
            star.mutate({ id })
        }
    }

    const isPending = star.isPending || unstar.isPending

    if (songIsPending) return

    return (
        <HeartIcon
            className={cn(
                classes.favorite,
                starred && classes.starred,
                isPending && classes.loading,
            )}
            onClick={onClick}
        />
    )
}
