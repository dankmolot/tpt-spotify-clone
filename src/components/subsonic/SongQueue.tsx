import { useQueries } from "@tanstack/react-query"
import { useMemo } from "react"
import { getSongOptions } from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import classes from "./SongQueue.module.css"
import { SongTable } from "./SongTable"

export default function SongQueue() {
    const queueOpen = usePlayerState((s) => s.queueOpen)

    return (
        <div className={cn(classes.songQueue, queueOpen && classes.open)}>
            <div className={classes.content}>
                <h3>Queue</h3>
                <TheQueue />
            </div>
        </div>
    )
}

function TheQueue() {
    const queue = usePlayerState((s) => s.queue)
    const queries = useQueries({
        queries: queue.map((id) => ({
            ...getSongOptions({ id }),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        })),
    })

    const songs = useMemo(
        () => queries.map((q) => q.data).filter((s) => !!s),
        [queries],
    )

    return <SongTable songs={songs} withCoverArt withArtists />
}
