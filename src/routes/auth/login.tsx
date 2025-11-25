import { createFileRoute } from "@tanstack/react-router"
import clsx from "clsx"
import { Logo } from "@/components/Logo"
import classes from "./login.module.scss"

export const Route = createFileRoute("/auth/login")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className={clsx("panel", classes.loginBox)}>
            <Logo />
            <h1>Welcome back</h1>
        </div>
    )
}
