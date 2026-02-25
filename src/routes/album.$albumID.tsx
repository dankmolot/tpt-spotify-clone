import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { type CSSProperties, useState } from "react"
import { CoverGradientContainer } from "@/components/CoverGradientContainer"
import { AlbumOverview } from "@/components/subsonic/Overview"
import { SongTable } from "@/components/subsonic/SongTable"
import { getQueryClient } from "@/integrations/tanstack-query/root-provider"
import { useVibrant } from "@/lib/hooks/useVibrant"
import { getAlbumOptions } from "@/lib/queries/subsonic"

export const Route = createFileRoute("/album/$albumID")({
    loader: ({ params: { albumID } }) =>
        getQueryClient().ensureQueryData(getAlbumOptions({ id: albumID })),
    component: AlbumPage,
})

function AlbumPage() {
    const { albumID } = Route.useParams()
    const { data: album } = useSuspenseQuery(getAlbumOptions({ id: albumID }))
    const [coverImage, setCoverImage] = useState<HTMLImageElement>()
    const palette = useVibrant(coverImage)

    const style = { "--coverColor": palette?.Vibrant?.hex } as CSSProperties

    return (
        <div style={style}>
            <AlbumOverview album={album} onCoverLoaded={setCoverImage} />
            <CoverGradientContainer>
                <SongTable songs={album.song} withArtists withHeader />
            </CoverGradientContainer>
        </div>
    )
}
