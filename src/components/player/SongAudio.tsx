import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type SyntheticEvent, useEffect, useRef } from "react"
import { useShallow } from "zustand/react/shallow"
import type { Child } from "@/lib/api/subsonic/schemas"
import { getSongKey } from "@/lib/queries/keys"
import {
    getCoverArtURL,
    getSongOptions,
    streamURL,
} from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"

export function SongAudio() {
    const ref = useRef<HTMLAudioElement>(null)
    const queryClient = useQueryClient()
    const songID = usePlayerState((s) => s.songID)
    const [playing, setPlaying] = usePlayerState(
        useShallow((s) => [s.playing, s.setPlaying]),
    )
    const [volume, setVolume] = usePlayerState(
        useShallow((s) => [s.volume, s.setVolume]),
    )
    const [playbackRate, setPlaybackRate] = usePlayerState(
        useShallow((s) => [s.playbackRate, s.setPlaybackRate]),
    )
    const [seekPos, seeking] = usePlayerState(
        useShallow((s) => [s.seekPos, s.seeking]),
    )
    const loop = usePlayerState((s) => s.loop)
    const muted = usePlayerState((s) => s.muted)
    const seekQueue = usePlayerState((s) => s.seekQueue)
    const [setCurrentTime, setDuration, setError, setBuffered, setState] =
        usePlayerState(
            useShallow((s) => [
                s.setCurrentTime,
                s.setDuration,
                s.setError,
                s.setBuffered,
                s.setState,
            ]),
        )

    // Play/pause
    // biome-ignore lint/correctness/useExhaustiveDependencies(songID): make sure play state is synchronized
    useEffect(() => {
        if (!ref.current) return
        if (playing && ref.current.paused) {
            ref.current.play()
        } else if (!playing && !ref.current.paused) {
            ref.current.pause()
        }
    }, [songID, playing])

    // Volume changing
    useEffect(() => {
        if (!ref.current) return
        ref.current.volume = volume
    }, [volume])

    // Muting
    useEffect(() => {
        if (!ref.current) return
        ref.current.muted = muted
    }, [muted])

    // Seeking
    useEffect(() => {
        if (!ref.current || seeking) return
        ref.current.currentTime = seekPos
    }, [seekPos, seeking])

    // Seeking
    // biome-ignore lint/correctness/useExhaustiveDependencies(playing): only should be triggered when seeking is changed
    useEffect(() => {
        if (!ref.current) return
        if (seeking && !ref.current.paused) {
            // pause during seeking
            ref.current.pause()
        } else if (!seeking && playing && ref.current.paused) {
            // and undo previous pausing
            ref.current.play()
            setPlaying(!ref.current.paused)
        }
    }, [seeking, setPlaying])

    // Playback rate
    useEffect(() => {
        if (!ref.current) return
        ref.current.playbackRate = playbackRate
    }, [playbackRate])

    // Looping
    useEffect(() => {
        if (!ref.current) return
        ref.current.loop = loop === "one"
    }, [loop])

    // Preload duration from tanstack query cache
    useEffect(() => {
        const song = queryClient.getQueryData(getSongKey(songID)) as
            | Child
            | undefined

        const duration = song?.duration
        if (duration) {
            setDuration(duration)
        }
    }, [queryClient, songID, setDuration])

    // Handle events for the queue
    function onEnded(e: SyntheticEvent<HTMLAudioElement>) {
        // Make sure we are handling only on sond ended, not because no futher data is available
        if (e.currentTarget.currentTime !== e.currentTarget.duration) return

        if (seekQueue(true)) {
            setPlaying(true)
        }
    }

    return (
        <audio
            ref={ref}
            src={songID ? streamURL({ id: songID }) : undefined}
            preload="auto"
            crossOrigin="anonymous"
            style={{ display: "none" }} // just in case, dom was acting strangely
            onPlay={() => !seeking && setPlaying(true)}
            onPause={() => !seeking && setPlaying(false)}
            onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
            onTimeUpdate={(e) =>
                // unfortunately "progress" and "canplay" events
                // are not reliable for "buffered" changes
                setCurrentTime(
                    e.currentTarget.currentTime,
                    e.currentTarget.buffered,
                )
            }
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onRateChange={(e) => setPlaybackRate(e.currentTarget.playbackRate)}
            onError={(e) => setError(e.currentTarget.error || undefined)}
            onProgress={(e) => setBuffered(e.currentTarget.buffered)}
            onLoadStart={() => setState("start")}
            onCanPlayThrough={() => setState("ready")}
            onCanPlay={(e) => setBuffered(e.currentTarget.buffered)}
            onEnded={onEnded}
        // handle waiting and stalled?
        />
    )
}

export function SongMediaSession() {
    const songID = usePlayerState((s) => s.songID)
    const { data: song } = useQuery({
        ...getSongOptions({ id: songID }),
        enabled: !!songID,
    })

    useEffect(() => {
        if (!song) return

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

    return null
}
