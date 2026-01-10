import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useEffect, useRef } from "react"
import {
    getCoverArtURL,
    getSongOptions,
    streamURL,
} from "@/lib/queries/subsonic"

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
    const audioURL = streamURL({ id: song.id })
    const coverArtURL = getCoverArtURL({ id: song.id })
    const ref = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (!ref.current) return

        ref.current.volume = 0.1
        // ref.current.play() // play must be launched from javscript

        navigator.mediaSession.playbackState = ref.current.paused ? "paused" : "playing"
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [
                {
                    src: coverArtURL,
                },
            ],
        })
    }, [song, coverArtURL])

    return (
        <h1>
            Music!
            <img src={coverArtURL} alt="cover art" width={120}></img>
            <audio
                ref={ref}
                src={audioURL}
                preload="auto"
                controls
            />
        </h1>
    )
}
