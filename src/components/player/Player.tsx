import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getSongOptions } from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"
import { CoverArt } from "../subsonic/Album"
import { SongAudio } from "./SongAudio"

export function Player() {
    const songID = usePlayerState((s) => s.songID)
    const { data: song, error } = useQuery({
        ...getSongOptions({ id: songID }),
        enabled: !!songID,
    })
    const [playing, setPlaying] = useState(false)

    if (!songID) return <p>please select a song</p>

    if (error) return <p style={{ color: "red" }}>{error.message}</p>

    if (!song) return <small>loading...</small>

    return (
        <h1>
            Music!
            <CoverArt id={song.coverArt} width={120} />
            <SongAudio song={song} playing={playing} />
            <button type="button" onClick={() => setPlaying(!playing)}>
                {playing ? "pause" : "play"}
            </button>
        </h1>
    )
}
