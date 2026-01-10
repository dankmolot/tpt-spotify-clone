import { useEffect, useRef } from "react"
import type { Child } from "@/lib/api/subsonic/schemas"
import { getCoverArtURL, streamURL } from "@/lib/queries/subsonic"

export interface AudioProps {
    song: Child
    playing?: boolean
}

export function SongAudio({ song, playing }: AudioProps) {
    const ref = useRef<HTMLAudioElement>(null)
    const audioURL = streamURL({ id: song.id })

    useEffect(() => {
        if (!ref.current) return
        ref.current.volume = 0.1
    }, [])

    useEffect(() => {
        if (!ref.current) return

        navigator.mediaSession.playbackState = ref.current.paused ? "paused" : "playing"
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [
                {
                    src: getCoverArtURL({ id: song.id }),
                },
            ],
        })
    }, [song])

    useEffect(() => {
        if (!ref.current) return

        if (playing && ref.current.paused) {
            ref.current.play()
        } else if (!playing && !ref.current.paused) {
            ref.current.pause()
        }
    }, [playing])

    return <audio
        ref={ref}
        src={audioURL}
        preload="auto"
    />
}
