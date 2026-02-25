import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { shuffleArray } from "./utils"

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

export interface PlayerState {
    songID: string
    setSongID: (id: string) => void
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
    originalQueue: string[]
    queue: string[]
    queueID: string
    setQueue: (queue: string[], queueID?: string) => void
    seekQueue: (forward: boolean) => boolean
    shuffled: boolean
    shuffle: () => void
    unshuffle: () => void
    queueOpen: boolean
    setQueueOpen: (queueOpen: boolean) => void
}

const initialPlayerState: Partial<PlayerState> = {
    currentTime: 0,
    duration: 0,
    error: undefined,
    buffered: [],
    state: "start",
}

const defaultPlayerState: Partial<PlayerState> = {
    ...initialPlayerState,

    songID: "",
    playing: false,
    volume: 1,
    muted: false,
    seeking: false,
    seekPos: 0,
    playbackRate: 1,
    loop: "none",
    originalQueue: [],
    queue: [],
    queueID: "",
    shuffled: false,
    queueOpen: false,
}

export const usePlayerState = create<PlayerState>()(
    devtools(
        (set, get) => ({
            ...defaultPlayerState,
            setSongID: (songID) => {
                if (get().songID === songID) {
                    set({ state: "start" })
                    return
                }

                set({ ...initialPlayerState, songID })
            },
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
            setQueue: (queue, queueID) => {
                set({ originalQueue: queue, queue, queueID })
                if (get().shuffled) get().shuffle()
            },
            seekQueue: (forward: boolean) => {
                const { queue, songID, loop, currentTime, setSongID } = get()
                const currentIndex = queue.indexOf(songID)
                if (currentIndex === -1) {
                    console.warn(
                        `for some reason queue was not populated, unable to seek in the queue songID=${songID} queue=`,
                        queue,
                    )
                    return false
                }

                // first, go back or forward in the queue
                // out of bounds will result in undefined
                let nextID: string | undefined =
                    queue[
                        currentIndex + (forward ? 1 : currentTime < 3 ? -1 : 0)
                    ]

                if (!nextID) {
                    // if no next song was found, and loop enabled, then just go around
                    if (loop === "queue") {
                        nextID = queue.at(forward ? 0 : -1)
                        if (!nextID) {
                            console.warn(
                                `unable to find next song in queue forward=${forward} songID=${songID} currentIndex=${currentIndex} queue=`,
                                queue,
                            )
                            nextID = songID
                        }
                    } else if (!forward) {
                        // if we go backwards, just stay on first index
                        nextID = queue[0]
                    }
                }

                if (nextID) setSongID(nextID)

                return !!nextID
            },
            shuffle: () => {
                const shuffledQueue = shuffleArray(get().queue, Date.now())
                set({ queue: shuffledQueue, shuffled: true })
            },
            unshuffle: () =>
                set({ shuffled: false, queue: get().originalQueue }),
            setQueueOpen: (queueOpen) => set({ queueOpen }),
        }),
        { name: "Player" },
    ),
)
