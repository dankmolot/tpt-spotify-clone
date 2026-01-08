import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import TanStackQueryLayout from "@/integrations/tanstack-query/layout"

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools position="top-right" />

            <TanStackQueryLayout />
        </>
    )
}
