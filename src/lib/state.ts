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

interface PlayerState {
    songID: string
    setSong: (id: string) => void
    playing: boolean
    setPlaying: (playing: boolean) => void
    volume: number
    setVolume: (volume: number) => void
    currentTime: number
    setCurrentTime: (currentTime: number) => void
    seek: (amount: number) => void
    duration: number
    setDuration: (duration: number) => void
    playbackRate: number
    setPlaybackRate: (playbackRate: number) => void
    error?: MediaError
    setError: (error?: MediaError) => void
    buffered?: BufferedRange[]
    setBuffered: (buffered: TimeRanges) => void
    state: MediaState
    setState: (state: MediaState) => void
    loop: boolean
    setLoop: (loop: boolean) => void
}

const defaultPlayingState: Partial<PlayerState> = {
    songID: "",
    playing: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    state: "start",
    loop: false,
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
                    buffered: undefined,
                    state: "start",
                }),
            setPlaying: (playing) => set({ playing }),
            setVolume: (volume) =>
                set({ volume: Math.min(Math.max(volume, 0), 1) }),
            setCurrentTime: (currentTime) => {
                currentTime = Math.floor(currentTime)
                currentTime = Math.max(Math.min(currentTime, get().duration), 0)

                if (get().currentTime !== currentTime) {
                    set({ currentTime: currentTime })
                }
            },
            seek: (amount) => get().setCurrentTime(get().currentTime + amount),
            setDuration: (duration) => set({ duration }),
            setPlaybackRate: (playbackRate) =>
                set({
                    playbackRate: Math.max(Math.min(playbackRate, 4), 0.25), // Gecko mutes rate outside this range
                }),
            setError: (error) => set({ error }),
            setBuffered: (buffered) =>
                set({ buffered: parseTimeRanges(buffered) }),
            setState: (state) => {
                if (get().state !== state) set({ state })
            },
            setLoop: (loop) => set({ loop }),
        }),
        { name: "Player" },
    ),
)
