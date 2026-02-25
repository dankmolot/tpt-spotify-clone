import {
    ListMusicIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeIcon,
    VolumeXIcon,
} from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { usePlayerState } from "@/lib/state"
import { Slider } from "../custom/Slider"
import classes from "./SecondaryControls.module.css"

export function SecondaryControls() {
    return (
        <div className={classes.panel}>
            <ListMusicIcon className={classes.queue} />
            <VolumeSlider />
        </div>
    )
}

export function VolumeSlider() {
    const [volume, muted, setVolume, setMuted] = usePlayerState(
        useShallow((s) => [s.volume, s.muted, s.setVolume, s.setMuted]),
    )

    const linearVolume = Math.sqrt(volume)

    return (
        <div className={classes.volume}>
            <button
                type="button"
                className={classes.icon}
                onClick={() => setMuted(!muted)}
            >
                {((muted || volume === 0) && <VolumeXIcon />) ||
                    (linearVolume < 1 / 3 && <VolumeIcon />) ||
                    (linearVolume < 2 / 3 && <Volume1Icon />) || (
                        <Volume2Icon />
                    )}
            </button>

            <Slider
                minValue={0}
                maxValue={1}
                step={0}
                value={!muted ? linearVolume : 0}
                onChanged={(v) => {
                    if (muted) {
                        setMuted(false)
                    }

                    setVolume(v ** 2)
                }}
                className={classes.slider}
            />
        </div>
    )
}
