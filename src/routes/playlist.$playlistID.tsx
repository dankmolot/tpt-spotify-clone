import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { type CSSProperties, useEffect, useState } from "react"
import { CoverGradientContainer } from "@/components/CoverGradientContainer"
import { PlaylistOverview } from "@/components/subsonic/Overview"
import { PlayControlsForSongs } from "@/components/subsonic/PlayControls"
import { SongTable } from "@/components/subsonic/SongTable"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { useVibrant } from "@/lib/hooks/useVibrant"
import { getPlaylistOptions } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/playlist/$playlistID")({
    loader: ({ params: { playlistID } }) =>
        getQueryClient().ensureQueryData(
            getPlaylistOptions({ id: playlistID }),
        ),
    component: PlaylistPage,
})

function PlaylistPage() {
    const { playlistID } = Route.useParams()
    const { data: playlist } = useSuspenseQuery(
        getPlaylistOptions({ id: playlistID }),
    )
    const [coverImage, setCoverImage] = useState<HTMLImageElement>()
    const palette = useVibrant(coverImage)

    useEffect(() => {
        console.log(playlist)
    }, [playlist])

    const style = { "--coverColor": palette?.Vibrant?.hex } as CSSProperties
    return (
        <div key={playlistID} style={style}>
            <PlaylistOverview
                playlist={playlist}
                onCoverLoaded={setCoverImage}
            />
            <CoverGradientContainer style={{ padding: "1.5em" }}>
                <PlayControlsForSongs
                    songs={playlist.entry}
                    style={{ marginBottom: "1em" }}
                />
                <SongTable
                    songs={playlist.entry}
                    withArtists
                    withHeader
                    withCoverArt
                    withAlbum
                />
            </CoverGradientContainer>
        </div>
    )
}
