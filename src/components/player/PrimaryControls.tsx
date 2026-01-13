import {
    PauseIcon,
    PlayIcon,
    Repeat1Icon,
    RepeatIcon,
    ShuffleIcon,
    SkipBackIcon,
    SkipForwardIcon,
} from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import classes from "./PrimaryControls.module.css"

export function PrimaryControls() {
    return (
        <div className={classes.panel}>
            <Buttons />
            <Progress />
        </div>
    )
}

function Buttons() {
    return (
        <div className={classes.buttons}>
            <Shuffle />
            <SkipBack />
            <PlayPause />
            <SkipForward />
            <Loop />
        </div>
    )
}

function Shuffle() {
    return (
        <button type="button">
            <ShuffleIcon />
        </button>
    )
}

function SkipBack() {
    return (
        <button type="button">
            <SkipBackIcon className={classes.fill} />
        </button>
    )
}

function PlayPause() {
    const [playing, setPlaying] = usePlayerState(
        useShallow((s) => [s.playing, s.setPlaying]),
    )

    return (
        <button
            type="button"
            className={classes.playPause}
            onClick={() => setPlaying(!playing)}
        >
            {playing ? <PauseIcon /> : <PlayIcon className={classes.play} />}
        </button>
    )
}

function SkipForward() {
    return (
        <button type="button">
            <SkipForwardIcon className={classes.fill} />
        </button>
    )
}

function Loop() {
    const [loop, setLoop] = usePlayerState(
        useShallow((s) => [s.loop, s.setLoop]),
    )

    function switchLoop() {
        switch (loop) {
            case "none":
                setLoop("queue")
                break
            case "queue":
                setLoop("one")
                break
            default:
                setLoop("none")
                break
        }
    }

    return (
        <button
            type="button"
            onClick={switchLoop}
            className={cn(
                classes.loop,
                loop === "queue" && classes.queue,
                loop === "one" && classes.one,
            )}
        >
            {loop !== "one" ? <RepeatIcon /> : <Repeat1Icon />}
        </button>
    )
}

function humanTime(raw: number) {
    const hours = Math.floor(raw / 60 / 60)
    const minutes = Math.floor((raw / 60) % 60)
    const seconds = Math.round(raw % 60)
        .toString()
        .padStart(2, "0")

    if (hours !== 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    }

    return `${minutes}:${seconds}`
}

function Progress() {
    const [currentTime, duration] = usePlayerState(
        useShallow((s) => [s.currentTime, s.duration]),
    )

    return (
        <div className={classes.progress}>
            <span>{humanTime(currentTime)}</span>
            <div>
                <div></div>
            </div>
            <span>{humanTime(duration)}</span>
        </div>
    )
}
