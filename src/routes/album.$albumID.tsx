import { createFileRoute } from "@tanstack/react-router"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { getAlbumOption } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/album/$albumID")({
    loader: ({ params: { albumID } }) =>
        getQueryClient().ensureQueryData(getAlbumOption({ id: albumID })),
    component: RouteComponent,
})

function RouteComponent() {
    const { albumID } = Route.useParams()
    return <div>Hello {albumID}!</div>
}
