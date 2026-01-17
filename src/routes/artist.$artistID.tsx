import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/artist/$artistID")({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/artist/$artistID"!</div>
}
