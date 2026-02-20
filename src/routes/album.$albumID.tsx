import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { AlbumOverview } from "@/components/subsonic/Overview"
import { SongTable } from "@/components/subsonic/SongTable"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { getAlbumOptions } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/album/$albumID")({
    loader: ({ params: { albumID } }) =>
        getQueryClient().ensureQueryData(getAlbumOptions({ id: albumID })),
    component: AlbumPage,
})

function AlbumPage() {
    const { albumID } = Route.useParams()
    const { data: album } = useSuspenseQuery(getAlbumOptions({ id: albumID }))

    return (
        <>
            <AlbumOverview album={album} />
            <SongTable songs={album.song} />
        </>
    )
}
