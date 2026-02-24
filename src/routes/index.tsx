import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { CoverGradientContainer } from "@/components/CoverGradientContainer"
import { AlbumCard } from "@/components/subsonic/Card"
import type { GetAlbumList2 } from "@/lib/api/subsonic/types"
import { getAlbumList2Options } from "@/lib/queries/subsonic"
import classes from "./index.module.css"

export const Route = createFileRoute("/")({
    component: Index,
})

function Index() {
    return (
        <div className={classes.main}>
            <CoverGradientContainer className={classes.inner}>
                <AlbumList title="Most Played" options={{ type: "frequent" }} />
                <AlbumList title="Explore" options={{ type: "random" }} />
                <AlbumList title="New Stuff" options={{ type: "newest" }} />
                <AlbumList
                    title="Recently Played"
                    options={{ type: "recent" }}
                />
                <AlbumList
                    title="Your Favorites"
                    options={{ type: "starred" }}
                />
            </CoverGradientContainer>
        </div>
    )
}

interface AlbumListProps {
    title: string
    options: GetAlbumList2
}

function AlbumList({ title, options }: AlbumListProps) {
    return (
        <div className={classes.albumList}>
            <h3 className={classes.title}>{title}</h3>
            <AlbumListCourasel options={options} />
        </div>
    )
}

interface AlbumListCouraselProps {
    options: GetAlbumList2
}

function AlbumListCourasel({ options }: AlbumListCouraselProps) {
    const { data: albums, error } = useQuery({
        ...getAlbumList2Options({ size: 25, ...options }),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    if (error) {
        return <span style={{ color: "red" }}>{error.message}</span>
    }

    if (!albums) return

    return (
        <div className={classes.carousel}>
            {albums.map((album) => (
                <AlbumCard album={album} key={album.id} />
            ))}
        </div>
    )
}
