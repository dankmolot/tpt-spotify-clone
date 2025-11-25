import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    return (
        <div>
            <h1>test</h1>
            <button type="button">test</button>
        </div>
    );
}
