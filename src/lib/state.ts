import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface BufferedRange {
    start: number
    end: number
}

function parseTimeRanges(ranges: TimeRanges) {
    const result: BufferedRange[] = []
    for (let i = 0; i < ranges.length; i++) {
        result.push({ start: ranges.start(i), end: ranges.end(i) })
    }
    return result
}

export type MediaState = "start" | "ready"
export type LoopType = "none" | "one" | "queue"

interface PlayerState {
    songID: string
    setSong: (id: string) => void
    playing: boolean
    setPlaying: (playing: boolean) => void
    volume: number
    setVolume: (volume: number) => void
    muted: boolean
    setMuted: (muted: boolean) => void
    currentTime: number
    setCurrentTime: (currentTime: number, buffered?: TimeRanges) => void
    seeking: boolean
    setSeeking: (seeking: boolean) => void
    seekPos: number
    setSeekPos: (seekPos: number) => void
    seek: (amount: number) => void
    duration: number
    setDuration: (duration: number) => void
    playbackRate: number
    setPlaybackRate: (playbackRate: number) => void
    error?: MediaError
    setError: (error?: MediaError) => void
    buffered: BufferedRange[]
    setBuffered: (buffered: TimeRanges) => void
    state: MediaState
    setState: (state: MediaState) => void
    loop: LoopType
    setLoop: (loop: LoopType) => void
}

const defaultPlayingState: Partial<PlayerState> = {
    songID: "",
    playing: false,
    volume: 1,
    muted: false,
    currentTime: 0,
    seeking: false,
    seekPos: 0,
    duration: 0,
    playbackRate: 1,
    buffered: [],
    state: "start",
    loop: "none",
}

export const usePlayerState = create<PlayerState>()(
    devtools(
        (set, get) => ({
            ...defaultPlayingState,
            setSong: (songID) =>
                set({
                    songID,
                    currentTime: 0,
                    duration: 0,
                    error: undefined,
                    buffered: [],
                    state: "start",
                }),
            setPlaying: (playing) => set({ playing }),
            setVolume: (volume) =>
                set({ volume: Math.min(Math.max(volume, 0), 1) }),
            setMuted: (muted) => set({ muted }),
            setCurrentTime: (currentTime, buffered) => {
                currentTime = Math.floor(currentTime)
                currentTime = Math.max(Math.min(currentTime, get().duration), 0)

                if (get().currentTime !== currentTime) {
                    set({ currentTime: currentTime })
                    buffered && get().setBuffered(buffered)
                }
            },
            setSeeking: (seeking) => set({ seeking }),
            setSeekPos: (seekPos) => set({ seekPos }),
            seek: (amount) => get().setSeekPos(get().seekPos + amount),
            setDuration: (duration) => set({ duration: Math.floor(duration) }),
            setPlaybackRate: (playbackRate) =>
                set({
                    playbackRate: Math.max(Math.min(playbackRate, 4), 0.25), // Gecko mutes rate outside this range
                }),
            setError: (error) => set({ error }),
            setBuffered: (buffered) => {
                const old = get().buffered
                const parsed = parseTimeRanges(buffered)
                // check if buffered has changed at all
                if (
                    old.length !== parsed.length ||
                    !old.every(
                        (v, i) =>
                            v.start === parsed[i]?.start &&
                            v.end === parsed[i]?.end,
                    )
                ) {
                    set({ buffered: parsed })
                }
            },
            setState: (state) => {
                if (get().state !== state) set({ state })
            },
            setLoop: (loop) => set({ loop }),
        }),
        { name: "Player" },
    ),
)
