import { createFileRoute } from "@tanstack/react-router"
import { Album } from "@/components/subsonic/Album"
import * as subsonic from "@/lib/queries/subsonic"

export const Route = createFileRoute("/test")({
    component: Test,
})

function Test() {
    const { data: albums, error } = subsonic.useGetAlbumList2({
        type: "newest",
    })

    if (error) {
        return <span style={{ color: "red" }}>{error.message}</span>
    }

    if (!albums) return

    return albums.map(album => (<Album album={album} key={album.id} />))
}
