import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useEffect } from "react"
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

    useEffect(() => {
        const audio = new Audio(audioURL.href)
        audio.volume = 0.1 // please look into https://www.dr-lex.be/info-stuff/volumecontrols.html
        audio.play() // also never auto play!

        return () => audio.pause()
    }, [audioURL])

    useEffect(() => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [
                {
                    src: coverArtURL.href,
                },
            ],
        })
    }, [song, coverArtURL])

    return (
        <h1>
            Music! <img src={coverArtURL.href} alt="cover art" width={120}></img>
        </h1>
    )
}
