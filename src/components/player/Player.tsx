import { CurrentSong } from "./CurrentSong"
import classes from "./Player.module.css"
import { PrimaryControls } from "./PrimaryControls"
import { SecondaryControls } from "./SecondaryControls"
import { SongAudio, SongMediaSession } from "./SongAudio"

export function Player() {
    return (
        <div className={classes.player}>
            <CurrentSong />
            <PrimaryControls />
            <SecondaryControls />
            <SongAudio />
            <SongMediaSession />
        </div>
    )
}
