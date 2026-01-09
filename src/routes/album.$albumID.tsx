import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/album/$albumID")({
    // loader: () => getContext().queryClient.ensureQueryData({ queryKey: "" }),
    component: RouteComponent,
})

function RouteComponent() {
    const { albumID } = Route.useParams()
    return <div>Hello {albumID}!</div>
}
