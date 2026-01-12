import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useEffect } from "react"
import {
    getSongOptions,
    useMutateStar,
    useMutateUnstar,
} from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import { CoverArt } from "../subsonic/CoverArt"
import classes from "./CurrentSong.module.css"

export function CurrentSong() {
    const songID = usePlayerState((s) => s.songID)

    if (!songID) return <div></div>

    return (
        <div className={classes.panel}>
            <CoverArt id={songID} className={classes.coverArt} />
            <SongInfo songID={songID} />
            <FavoriteButton songID={songID} />
        </div>
    )
}
interface SongIDProps {
    songID: string
}

function SongInfo({ songID }: SongIDProps) {
    const { data: song, error } = useQuery({
        ...getSongOptions({ id: songID }),
        select: (song) => ({
            title: song.title,
            artist: song.artist,
        }),
    })

    useEffect(() => {
        if (!error) return

        console.error("unable to load current song", error)
    }, [error])

    return (
        <div className={classes.info}>
            <span className={classes.title}>{song?.title}</span>
            <span className={classes.author}>{song?.artist}</span>
        </div>
    )
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
