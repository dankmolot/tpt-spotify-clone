import { useQueries } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { getSongOptions } from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"
import { cn } from "@/lib/utils"
import classes from "./SongQueue.module.css"
import { SongTable } from "./SongTable"

export function SongQueue() {
    const queueOpen = usePlayerState((s) => s.queueOpen)
    const [busy, setBusy] = useState(false)

    return (
        <div
            className={cn(classes.songQueue, queueOpen && classes.open)}
            onAnimationStart={() => setBusy(true)}
            onAnimationEnd={() => setBusy(false)}
        >
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
            enabled: false,
        })),
    })

    const songs = useMemo(
        () => queries.map((q) => q.data).filter((s) => !!s),
        [queries],
    )

    return <SongTable songs={songs} withCoverArt withArtists />
}
