import Header from "@/components/Header";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <>
            <Header />
            <Outlet />
            {/* <TanStackRouterDevtools /> */}

            {/* <TanStackQueryLayout /> */}
        </>
    );
}
