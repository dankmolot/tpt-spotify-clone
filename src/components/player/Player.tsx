import { CurrentSong } from "./CurrentSong"
import classes from "./Player.module.css"
import { PrimaryControls } from "./PrimaryControls"
import { SecondaryControls } from "./SecondaryControls"

export function Player() {
    // const songID = usePlayerState((s) => s.songID)
    // const { data: song, error } = useQuery({
    //     ...getSongOptions({ id: songID }),
    //     enabled: !!songID,
    // })
    // const [playing, setPlaying] = useState(false)

    // if (!songID) return <p>please select a song</p>

    // if (error) return <p style={{ color: "red" }}>{error.message}</p>

    // if (!song) return <small>loading...</small>

    return (
        <div className={classes.player}>
            <CurrentSong />
            <PrimaryControls />
            <SecondaryControls />
            {/* Music! */}
            {/* <CoverArt id={song.coverArt} width={120} /> */}
            {/* <SongAudio song={song} playing={playing} /> */}
            {/* <button type="button" onClick={() => setPlaying(!playing)}>
                {playing ? "pause" : "play"}
            </button> */}
        </div>
    )
}
