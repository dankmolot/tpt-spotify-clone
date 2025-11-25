import { createFileRoute } from "@tanstack/react-router"
import { Button, Form, Input, Label, TextField } from "react-aria-components"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"
import classes from "./login.module.scss"

export const Route = createFileRoute("/auth/login")({
    component: RouteComponent,
})

interface Fields {
    server: string
    user: string
    pass: string
}

function RouteComponent() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Fields>()

    const onSubmit: SubmitHandler<Fields> = (data) => {
        console.log("eee")
    }

    return (
        <Form
            className={cn("panel", classes.loginBox)}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Logo />
            <h1>Welcome back</h1>

            <TextField>
                <Label>Server</Label>
                <Input placeholder="https://demo.navidrome.org" type="url" />
            </TextField>

            <TextField>
                <Label>User</Label>
                <Input placeholder="demo" />
            </TextField>

            <TextField>
                <Label>Pass</Label>
                <Input placeholder="demo" type="password" />
            </TextField>

            <Button type="submit">Login</Button>
        </Form>
    )
}
