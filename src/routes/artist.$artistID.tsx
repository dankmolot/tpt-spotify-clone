import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { type ComponentPropsWithRef, type CSSProperties, useState } from "react"
import { CoverGradientContainer } from "@/components/CoverGradientContainer"
import { type ConverArtProps, CoverArt } from "@/components/subsonic/CoverArt"
import { SongTable } from "@/components/subsonic/SongTable"
import { useVibrant } from "@/lib/hooks/useVibrant"
import { getArtistOptions, getTopSongsOptions } from "@/lib/queries/subsonic"
import { cn } from "@/lib/utils"
import classes from "./artist.$artistID.module.css"

export const Route = createFileRoute("/artist/$artistID")({
    component: RouteComponent,
})

function RouteComponent() {
    const [img, setImg] = useState<HTMLImageElement | undefined>()
    const pallete = useVibrant(img)

    return (
        <div style={{ "--coverColor": pallete?.Vibrant?.hex } as CSSProperties}>
            <ArtistOverview onLoad={(e) => setImg(e.currentTarget)} />
            <CoverGradientContainer className={classes.mainContent}>
                <TopSongs />
            </CoverGradientContainer>
        </div>
    )
}

interface ArtistOverviewBaseProps extends ComponentPropsWithRef<"div"> {
    coverArt?: string
}

function ArtistOverviewBase({
    coverArt,
    children,
    className,
    ...props
}: ArtistOverviewBaseProps) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div
            className={cn(
                classes.overview,
                loaded && classes.loaded,
                className,
            )}
            {...props}
        >
            {coverArt && (
                <CoverArt
                    id={coverArt}
                    alt="Artist Background"
                    className={classes.background}
                    onLoad={() => setLoaded(true)}
                />
            )}
            <div className={classes.content}>{children}</div>
        </div>
    )
}

function ArtistOverview({ onLoad }: { onLoad?: ConverArtProps["onLoad"] }) {
    const { artistID } = Route.useParams()
    const { data: artist, error } = useQuery(getArtistOptions({ id: artistID }))

    if (error) {
        return (
            <ArtistOverviewBase className={classes.loaded}>
                <span style={{ color: "red" }}>{error.message}</span>
            </ArtistOverviewBase>
        )
    }

    if (!artist) return <ArtistOverviewBase />

    return (
        <ArtistOverviewBase coverArt={artist.coverArt}>
            <CoverArt id={artist.coverArt} onLoad={onLoad} />
            <div>
                <h1>{artist.name}</h1>
                <p>{artist.album?.length} albums</p>
            </div>
        </ArtistOverviewBase>
    )
}

function TopSongs() {
    const { artistID } = Route.useParams()
    const { data: artist } = useQuery(getArtistOptions({ id: artistID }))
    const { data: songs } = useQuery({
        ...getTopSongsOptions({ artist: artist?.name ?? "" }),
        enabled: !!artist,
    })
    const [showMore, setShowMore] = useState(false)

    return (
        <div className={classes.topSongs}>
            <h2>Popular</h2>
            <SongTable
                songs={songs}
                withCoverArt
                withPlayCount
                limit={!showMore ? 5 : 10}
            />
            <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className={classes.showMore}
            >
                {showMore ? "See less" : "See more"}
            </button>
        </div>
    )
}
