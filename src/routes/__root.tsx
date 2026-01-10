import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Header } from "@/components/Header"
import { Player } from "@/components/player/Player"
import TanStackQueryLayout from "@/integrations/tanstack-query/layout"

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <>
            <Header />
            <div id="content">
                <Outlet />
                <TanStackRouterDevtools position="top-right" />
                <TanStackQueryLayout />
            </div>

            <Player />

        </>
    )
}
