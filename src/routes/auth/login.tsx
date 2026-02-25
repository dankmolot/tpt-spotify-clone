import { createFileRoute } from "@tanstack/react-router"
import { Button } from "react-aria-components"
import { Form } from "@/components/aria/Form"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"
import classes from "./login.module.scss"

export const Route = createFileRoute("/auth/login")({
    component: RouteComponent,
})

function RouteComponent() {
    // const form = useAppForm({
    //     defaultValues: {
    //         server: "",
    //         user: "",
    //         pass: "",
    //     },
    //     validators: {
    //         onChange: z.object({
    //             server: z.url(),
    //             user: z.string(),
    //             pass: z.string(),
    //         }),
    //     },
    //     onSubmit: async ({ value }) => {
    //         console.log(value)
    //         // ping.mutate()
    //     },
    // })

    // const ping = queries.subsonic.ping()

    return (
        <Form
            className={cn("panel", classes.loginBox)}
            // onSubmit={()}
        >
            <Logo />
            <h1 style={{ marginBottom: "1em" }}>Welcome back</h1>

            {/* <form.Field children={()} /> */}

            {/* <Controller
                name="server"
                control={control}
                defaultValue="https://demo.navidrome.org"
                rules={{}}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        fieldState={fieldState}
                        placeholder="https://demo.navidrome.org"
                    />
                )}
            /> */}

            {/* 
            <TextField style={{ marginBottom: "1em" }}>
                <Label>User</Label>
                <Input
                    placeholder="demo"
                    defaultValue="demo"
                    {...register("user")}
                />
                <FieldError />
            </TextField>

            <TextField style={{ marginBottom: "1em" }}>
                <Label>Pass</Label>
                <Input
                    placeholder="demo"
                    defaultValue="demo"
                    type="password"
                    {...register("pass")}
                />
                <FieldError />
            </TextField> */}

            <Button type="submit">Login</Button>
            {/* 
            {ping.isPending && <p>loading...</p>}
            {ping.data && <p>{JSON.stringify(ping.data)}</p>}
            {ping.isError && <p>{ping.error.message}</p>} */}
        </Form>
    )
}
