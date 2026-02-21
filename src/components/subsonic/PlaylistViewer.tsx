import { useQuery } from "@tanstack/react-query"
import { getPlaylistsOptions } from "@/lib/queries/subsonic"
import classes from "./PlaylistViewer.module.css"

export default function PlaylistViewer() {
    const { data: playlists } = useQuery(getPlaylistsOptions())
    if (!playlists) return

    return (
        <div className={classes.viewer}>
            <span className={classes.title}>Your Library</span>
            <div>
            {playlists.map((p) => p.name)}
            </div>
        </div>
    )
}
