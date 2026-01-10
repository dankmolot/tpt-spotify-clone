import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useEffect } from "react"
import { useBlob } from "@/lib/hooks/utils"
import { getCoverArtOptions, getSongOptions, streamOptions } from "@/lib/queries/subsonic"

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
    const [{ data: audioData }, { data: coverArtData }] = useSuspenseQueries({
        queries: [
            streamOptions({ id: song.id }),
            getCoverArtOptions({ id: song.coverArt! }),
        ]
    })
    const audioBlob = useBlob(audioData)
    const coverArtBlob = useBlob(coverArtData)

    useEffect(() => {
        if (!audioBlob) return

        const audio = new Audio(audioBlob)
        audio.volume = 0.1 // please look into https://www.dr-lex.be/info-stuff/volumecontrols.html
        // audio.play() // also never auto play!

        return () => audio.pause()
    }, [audioBlob])

    useEffect(() => {
        if (!coverArtBlob) return

        console.log(coverArtBlob, coverArtData)

        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [{
                src: coverArtBlob,
                type: coverArtData.type,
                sizes: "150x150"
            }]
        })
    }, [song, coverArtData, coverArtBlob])

    return <h1>Music! <img src={coverArtBlob} alt="cover art" width={120}></img></h1>
}
