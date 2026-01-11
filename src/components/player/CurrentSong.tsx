import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useEffect } from "react"
import { getSongOptions } from "@/lib/queries/subsonic"
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
            <Heart fill="white" height="1.25em" />
        </div>
    )
}
