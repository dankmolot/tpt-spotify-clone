import { EllipsisIcon, PauseIcon, PlayIcon, ShuffleIcon } from "lucide-react"
import { type ComponentPropsWithRef, useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import type { Child } from "@/lib/api/subsonic/schemas"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import classes from "./PlayControls.module.css"

export interface PlayControlsForSongsProps
    extends ComponentPropsWithRef<"div"> {
    songs?: Child[]
}

export function PlayControlsForSongs({
    songs,
    ...props
}: PlayControlsForSongsProps) {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
    const [queue, playing, setQueue, setSongID, setPlaying, shuffle] =
        usePlayerState(
            useShallow((s) => [
                s.queue,
                s.playing,
                s.setQueue,
                s.setSongID,
                s.setPlaying,
                s.shuffle,
            ]),
        )
    const currentQueue = useRef(queue)

    const onPlay = (mushShuffle: boolean) => {
        if (songs) {
            const queue = songs.map((s) => s.id)
            currentQueue.current = queue
            setQueue(queue)
            setSongID(songs[0]?.id)
            setPlaying(true)
            if (mushShuffle) shuffle()
        }
    }

    useEffect(() => {
        setCurrentlyPlaying(currentQueue.current === queue && playing)
    }, [queue, playing])

    return (
        <PlayControls
            {...props}
            onPlayPressed={onPlay}
            playing={currentlyPlaying}
        />
    )
}

export interface PlayControlsProps extends ComponentPropsWithRef<"div"> {
    onPlayPressed: (shuffled: boolean) => void
    playing?: boolean
}

export function PlayControls({
    onPlayPressed,
    playing = false,
    ...props
}: PlayControlsProps) {
    return (
        <div {...props} className={cn(classes.playControls, props.className)}>
            <Play playing={playing} onClick={() => onPlayPressed?.(false)} />
            <Shuffle onClick={() => onPlayPressed?.(true)} />
            <Misc />
        </div>
    )
}

function Play({
    playing,
    ...props
}: ComponentPropsWithRef<"button"> & { playing: boolean }) {
    return (
        <button {...props} type="button" className={classes.play}>
            {(playing && <PauseIcon />) || <PlayIcon />}
        </button>
    )
}

function Shuffle(props: ComponentPropsWithRef<"button">) {
    return (
        <button {...props} type="button" className={classes.iconButton}>
            <ShuffleIcon />
        </button>
    )
}

function Misc(props: ComponentPropsWithRef<"button">) {
    return (
        <button {...props} type="button" className={classes.iconButton}>
            <EllipsisIcon />
        </button>
    )
}
