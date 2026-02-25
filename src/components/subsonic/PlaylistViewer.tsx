import { useQuery } from "@tanstack/react-query"
import { getPlaylistsOptions } from "@/lib/queries/subsonic"
import { PlaylistItem } from "./Item"
import classes from "./PlaylistViewer.module.css"

export default function PlaylistViewer() {
    const { data: playlists } = useQuery(getPlaylistsOptions())

    return (
        <div className={classes.viewer}>
            <span className={classes.title}>Your Library</span>
            <div className={classes.list}>
                {playlists?.map((p) => (
                    <PlaylistItem key={p.id} playlist={p} />
                ))}
            </div>
        </div>
    )
}
