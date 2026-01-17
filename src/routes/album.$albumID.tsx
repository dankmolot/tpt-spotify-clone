import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useShallow } from "zustand/react/shallow"
import { Album } from "@/components/subsonic/Album"
import { Song } from "@/components/subsonic/Song"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { getAlbumOptions } from "@/lib/queries/subsonic"
import { usePlayerState } from "@/lib/state"

export const Route = createFileRoute("/album/$albumID")({
    loader: ({ params: { albumID } }) =>
        getQueryClient().ensureQueryData(getAlbumOptions({ id: albumID })),
    component: RouteComponent,
})

function RouteComponent() {
    const { albumID } = Route.useParams()
    const { data: album } = useSuspenseQuery(getAlbumOptions({ id: albumID }))
    const [songID, setSong] = usePlayerState(
        useShallow((s) => [s.songID, s.setSong]),
    )

    return (
        <>
            <Album album={album} />
            {album.song?.map((v) => (
                <button
                    key={v.id}
                    style={{
                        all: "unset",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5em",
                        margin: "1em",
                        height: "4em",
                    }}
                    type="button"
                    onClick={() => setSong(v.id)}
                >
                    <Song id={v.id} style={{ height: "4em" }} />
                </button>
                // <p key={v.id}>
                //     <button type="button" onClick={() => setSong(v.id)}>
                //         {v.title} {songID === v.id && "playing"}
                //     </button>
                // </p>
            ))}
        </>
    )
}
