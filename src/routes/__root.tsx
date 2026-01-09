import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Player } from "@/components/player/Player"
import TanStackQueryLayout from "@/integrations/tanstack-query/layout"

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <>
            <Outlet />
            <Player />
            <TanStackRouterDevtools position="top-right" />

            <TanStackQueryLayout />
        </>
    )
}
