import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import {
    getSongOptions,
    useMutateStar,
    useMutateUnstar,
} from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import { Song } from "../subsonic/Song"
import classes from "./CurrentSong.module.css"

export function CurrentSong() {
    const songID = usePlayerState((s) => s.songID)

    if (!songID) return <div className={classes.panel}></div>

    return (
        <div className={classes.panel}>
            <Song id={songID} className={classes.song} />
            {/* <CoverArt id={songID} className={classes.coverArt} />
            <SongInfo songID={songID} /> */}
            <FavoriteButton songID={songID} />
        </div>
    )
}

interface SongIDProps {
    songID: string
}

function FavoriteButton({ songID }: SongIDProps) {
    const { data: starred, isPending: songIsPending } = useQuery({
        ...getSongOptions({ id: songID }),
        select: (song) => !!song.starred,
    })

    const star = useMutateStar()
    const unstar = useMutateUnstar()

    function onClick() {
        if (starred) {
            unstar.mutate({ id: songID })
        } else {
            star.mutate({ id: songID })
        }
    }

    const isPending = star.isPending || unstar.isPending

    if (songIsPending) return

    return (
        <Heart
            className={cn(
                classes.favorite,
                starred && classes.starred,
                isPending && classes.loading,
            )}
            onClick={onClick}
        />
    )
}
