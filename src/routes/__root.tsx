import { createRootRoute, Outlet } from "@tanstack/react-router"
import { lazy } from "react"
import { Header } from "@/components/Header"
import { Player } from "@/components/player/Player"

const TanStackQueryLayout = lazy(() => import("@/integrations/tanstack-query/layout"))
const TanStackRouterDevtools = lazy(() => import("@tanstack/react-router-devtools").then(m => ({ default: m.TanStackRouterDevtools })))

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <>
            <Header />
            <div id="content">
                <Outlet />
                {/* <TanStackRouterDevtools position="top-right" />
                <TanStackQueryLayout /> */}
            </div>

            <Player />
        </>
    )
}
