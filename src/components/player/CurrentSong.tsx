import { useMutation, useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useEffect } from "react"
import type { Child } from "@/lib/api/subsonic/schemas"
import {
    getSongOptions,
    starOptions,
    unstarOptions,
} from "@/lib/queries/subsonic"
import { updateSong } from "@/lib/queries/updates"
import { cn } from "@/lib/utils"
import { CoverArt } from "../subsonic/CoverArt"
import classes from "./CurrentSong.module.css"

export function CurrentSong() {
    // const songID = usePlayerState((s) => s.songID)
    const songID = "GWqhusYmlzzGuSsucaeYyr"
    // const songID = "test"
    const { data: song, error } = useQuery(getSongOptions({ id: songID }))

    useEffect(() => {
        if (!error) return

        console.error("unable to load current song", error)
    }, [error])

    if (!song) return <div></div>

    return (
        <div className={classes.panel}>
            <CoverArt id={songID} className={classes.coverArt} />
            <div className={classes.info}>
                <span className={classes.title}>{song?.title}</span>
                <span className={classes.author}>{song?.artist}</span>
            </div>
            <FavoriteButton song={song} />
        </div>
    )
}

interface FavoriteButtonProps {
    song: Child
}

function FavoriteButton({ song }: FavoriteButtonProps) {
    const star = useMutation({
        ...starOptions,
        onSuccess: (_, __, ___, { client }) => updateSong(client, song),
    })
    const unstar = useMutation({
        ...unstarOptions,
        onSuccess: (_, __, ___, { client }) => updateSong(client, song),
    })

    function onClick() {
        if (song.starred) {
            unstar.mutate({ id: song.id })
        } else {
            star.mutate({ id: song.id })
        }
    }

    const isPending = star.isPending || unstar.isPending

    return (
        <Heart
            className={cn(
                classes.favorite,
                song.starred && classes.starred,
                isPending && classes.loading,
            )}
            onClick={onClick}
        />
    )
}
