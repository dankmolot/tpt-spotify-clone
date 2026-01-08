import { createFileRoute } from "@tanstack/react-router"
import { Album } from "@/components/subsonic/Album"
import * as subsonic from "@/lib/queries/subsonic"

export const Route = createFileRoute("/test")({
    component: Test,
})

function Test() {
    const { data: albums, error } = subsonic.useGetAlbumList2({
        type: "newest",
        size: 1,
    })

    if (error) {
        return <span style={{ color: "red" }}>{error.message}</span>
    }

    if (!albums) return

    return <Album album={albums[0]} />
}
