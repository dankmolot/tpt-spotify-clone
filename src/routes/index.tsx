import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Album } from "@/components/subsonic/Album"
import { getAlbumList2Options } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/")({
    component: Index,
})

function Index() {
    const { data: albums, error } = useQuery(
        getAlbumList2Options({
            type: "newest",
        }),
    )

    if (error) {
        return <span style={{ color: "red" }}>{error.message}</span>
    }

    if (!albums) return

    return albums.map((album) => <Album album={album} key={album.id} />)
}
