import {
    PauseIcon,
    PlayIcon,
    Repeat1Icon,
    RepeatIcon,
    ShuffleIcon,
    SkipBackIcon,
    SkipForwardIcon,
} from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { useShallow } from "zustand/react/shallow"
import { usePlayerState } from "@/lib/state"
import { cn, humanTime } from "@/lib/utils"
import {
    SliderController,
    SliderProgress,
    SliderThumb,
    SliderTrack,
} from "../custom/Slider"
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
    const seekQueue = usePlayerState((s) => s.seekQueue)

    return (
        <button type="button" onClick={() => seekQueue(false)}>
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
    const seekQueue = usePlayerState((s) => s.seekQueue)

    return (
        <button type="button" onClick={() => seekQueue(true)}>
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



function Progress() {
    return (
        <div className={classes.progress}>
            <ProgressTime />
            <ProgressSlider />
            <ProgressDuration />
        </div>
    )
}

function ProgressTime() {
    const currentTime = usePlayerState((s) =>
        s.seeking ? s.seekPos : s.currentTime,
    )
    return <span className={classes.currentTime}>{humanTime(currentTime)}</span>
}

function ProgressDuration() {
    const duration = usePlayerState((s) => s.duration)
    return <span className={classes.duration}>{humanTime(duration)}</span>
}

function ProgressSlider() {
    // Slider is split in such way to minimize re-renders
    return (
        <ProgressSliderController>
            <SliderTrack>
                <ProgressSliderBuffer />
                <SliderProgress />
            </SliderTrack>
            <SliderThumb />
        </ProgressSliderController>
    )
}

function ProgressSliderController(props: { children?: ReactNode }) {
    const [currentTime, duration, setSeeking, setSeekPos, setCurrentTime] =
        usePlayerState(
            useShallow((s) => [
                s.seeking ? s.seekPos : s.currentTime,
                s.duration,
                s.setSeeking,
                s.setSeekPos,
                s.setCurrentTime,
            ]),
        )

    return (
        <SliderController
            value={currentTime}
            maxValue={duration}
            onPressed={() => setSeeking(true)}
            onUnpressed={() => setSeeking(false)}
            onChanged={(value) => setSeekPos(value)}
            onChangedEnd={(value) => setCurrentTime(value)} // predict that currentTime will be same as seekPos
            className={classes.slider}
            {...props}
        />
    )
}

function ProgressSliderBuffer() {
    const [buffered, duration] = usePlayerState(
        useShallow((s) => [s.buffered, s.duration]),
    )

    return buffered.map((buffer) => {
        const style = {
            "--bufferStart": buffer.start / duration,
            "--bufferLength": (buffer.end - buffer.start) / duration,
        } as CSSProperties

        return (
            <SliderProgress
                className={classes.buffer}
                style={style}
                key={buffer.start}
            />
        )
    })
}
