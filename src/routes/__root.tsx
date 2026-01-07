import { createRootRoute, Outlet } from "@tanstack/react-router";
import TanStackQueryLayout from "@/integrations/tanstack-query/layout"

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <>
            <Outlet />
            {/* <TanStackRouterDevtools /> */}

            <TanStackQueryLayout />
        </>
    );
}
