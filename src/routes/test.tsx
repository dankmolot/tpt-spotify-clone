import { createFileRoute } from "@tanstack/react-router"
import { Album } from "@/components/subsonic/Album"
import * as subsonic from "@/lib/queries/subsonic"

export const Route = createFileRoute("/test")({
    component: Test,
})

function Test() {
    const { data } = subsonic.useGetAlbumList2({ type: "newest", size: 1 })

    if (!data) return

    if (data.status !== "ok") return

    return <Album album={data.albumList2.album[0]} />
}
