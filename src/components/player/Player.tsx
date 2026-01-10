import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useState } from "react"
import { getSongOptions } from "@/lib/queries/subsonic"
import { CoverArt } from "../subsonic/Album"
import { SongAudio } from "./SongAudio"

export function Player() {
    return (
        <Suspense fallback={<small>player is loading...</small>}>
            <PlayMusic />
        </Suspense>
    )
}

function PlayMusic() {
    const NEED_THIS = "kJ4CxKdARP8E6kLGhQbB57"
    const { data: song } = useSuspenseQuery(getSongOptions({ id: NEED_THIS }))
    const [playing, setPlaying] = useState(false)

    return (
        <h1>
            Music!
            <CoverArt id={song.coverArt} width={120} />
            <SongAudio song={song} playing={playing} />
            <button type="button" onClick={() => setPlaying(!playing)}>{playing ? "pause" : "play"}</button>
        </h1>
    )
}
