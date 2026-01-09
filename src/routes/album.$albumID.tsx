import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Album } from "@/components/subsonic/Album"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { getAlbumOptions } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/album/$albumID")({
    loader: ({ params: { albumID } }) =>
        getQueryClient().ensureQueryData(getAlbumOptions({ id: albumID })),
    component: RouteComponent,
})

function RouteComponent() {
    const { albumID } = Route.useParams()
    const { data: album } = useSuspenseQuery(getAlbumOptions({ id: albumID }))

    return (
        <>
            <Album album={album} />
            {album.song?.map((v) => (
                <p key={v.id}>{v.title}</p>
            ))}
        </>
    )
}
