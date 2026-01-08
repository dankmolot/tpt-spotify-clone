import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { api } from "@/lib/api"

export const Route = createFileRoute("/test")({
    component: Test,
})

function Test() {
    useEffect(() => {
        api.subsonic
            .getAlbumList2({ type: "newest" })
            .then(console.log)
            .catch(console.error)
    }, [])

    return <>hello</>
}
