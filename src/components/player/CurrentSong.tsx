import { usePlayerState } from "@/lib/state"
import { FavoriteSong, Song } from "../subsonic/Song"
import classes from "./CurrentSong.module.css"

export function CurrentSong() {
    const songID = usePlayerState((s) => s.songID)

    if (!songID) return <div className={classes.panel}></div>

    return (
        <div className={classes.panel}>
            <Song id={songID} online className={classes.song} />
            {/* <CoverArt id={songID} className={classes.coverArt} />
            <SongInfo songID={songID} /> */}
            <FavoriteSong id={songID} />
        </div>
    )
}
