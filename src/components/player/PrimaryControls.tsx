import {
    PauseIcon,
    PlayIcon,
    RepeatIcon,
    ShuffleIcon,
    SkipBackIcon,
    SkipForwardIcon,
} from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { usePlayerState } from "@/lib/state"
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
    const setPlaying = usePlayerState((s) => s.setPlaying)
    const [volume, setVolume] = usePlayerState(
        useShallow((s) => [s.volume, s.setVolume]),
    )
    const seek = usePlayerState((s) => s.seek)

    return (
        <div className={classes.buttons}>
            <ShuffleIcon />
            <SkipBackIcon />
            <PlayIcon />
            <PauseIcon />
            <SkipForwardIcon />
            <RepeatIcon />
            <button type="button" onClick={() => setPlaying(true)}>
                play
            </button>
            <button type="button" onClick={() => setPlaying(false)}>
                pause
            </button>
            <button type="button" onClick={() => setVolume(volume + 0.1)}>
                +volume
            </button>
            <button type="button" onClick={() => setVolume(volume - 0.1)}>
                -volume
            </button>
            <button type="button" onClick={() => seek(-10)}>
                {"<"}
            </button>
            <button type="button" onClick={() => seek(10)}>
                {">"}
            </button>
        </div>
    )
}

function Progress() {
    return (
        <div className={classes.progress}>
            <span>0:05</span>
            <div>
                <div></div>
            </div>
            <span>2:50</span>
        </div>
    )
}
