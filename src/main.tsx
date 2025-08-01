import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
    RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import TanStackQueryLayout from "./integrations/tanstack-query/layout.tsx";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import TanStackQueryDemo from "./routes/demo.tanstack-query.tsx";

import "./styles.css";

import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.ts";

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Header />
            <Outlet />
            <TanStackRouterDevtools />

            <TanStackQueryLayout />
        </>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: App,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    TanStackQueryDemo(rootRoute),
]);

const router = createRouter({
    routeTree,
    context: {
        ...TanStackQueryProvider.getContext(),
    },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <TanStackQueryProvider.Provider>
                <RouterProvider router={router} />
            </TanStackQueryProvider.Provider>
        </StrictMode>,
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
