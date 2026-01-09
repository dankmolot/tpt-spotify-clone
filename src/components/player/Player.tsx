import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useEffect } from "react"
import { useBlob } from "@/lib/hooks/utils"
import { streamOptions } from "@/lib/queries/subsonic"

export function Player() {
    return (
        <Suspense fallback={<small>player is loading...</small>}>
            <PlayMusic />
        </Suspense>
    )
}

function PlayMusic() {
    const NEED_THIS = "kJ4CxKdARP8E6kLGhQbB57"
    const { data } = useSuspenseQuery(streamOptions({ id: NEED_THIS }))
    const audioBlob = useBlob(data)

    useEffect(() => {
        if (!audioBlob) return

        const audio = new Audio(audioBlob)
        audio.volume = 0.1 // please look into https://www.dr-lex.be/info-stuff/volumecontrols.html
        // audio.play() // also never auto play!

        return () => audio.pause()
    }, [audioBlob])

    return <h1>Music!</h1>
}
