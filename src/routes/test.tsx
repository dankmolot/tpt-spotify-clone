import { createFileRoute } from "@tanstack/react-router"
import * as subsonic from "@/lib/queries/subsonic"

export const Route = createFileRoute("/test")({
    component: Test,
})

function Test() {
    const { data } = subsonic.getAlbumList2({ type: "newest", size: 1 })

    if (!data) return

    if (data.status !== "ok") return

    return <>{data.albumList2.album[0].name}</>
}
