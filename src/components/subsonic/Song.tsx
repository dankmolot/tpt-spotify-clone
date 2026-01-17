import { useQuery } from "@tanstack/react-query"
import { HeartIcon } from "lucide-react"
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react"
import {
    getSongOptions,
    useMutateStar,
    useMutateUnstar,
} from "@/lib/queries/subsonic"
import { cn } from "@/lib/utils"
import { Link } from "../custom/Link"
import { type ConverArtProps, CoverArt } from "./CoverArt"
import classes from "./Song.module.css"

export interface SongParams {
    /** Song ID */
    id: string
    /** Whenever to fetch song data, by default Song component will expect that the data was populated by other components */
    online?: boolean
}

export type SongProps = ComponentPropsWithRef<"div"> & SongParams

export function SongGroup({
    className,
    ...props
}: ComponentPropsWithRef<"div">) {
    return <div className={cn(classes.song, className)} {...props} />
}

export function Song({ id, online, ...props }: SongProps) {
    const songParams: SongParams = { id, online }

    return (
        <SongGroup {...props}>
            <SongCover {...songParams} />
            <SongInfo {...songParams} />
        </SongGroup>
    )
}

export function SongCover({
    id,
    online = false,
    className,
    ...props
}: Omit<ConverArtProps, "id"> & SongParams) {
    const { data: coverArtID, isLoading } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: ({ coverArt }) => coverArt,
    })

    if (isLoading) return

    return (
        <CoverArt
            id={coverArtID}
            className={cn(classes.songCover, className)}
            {...props}
        />
    )
}

export function SongInfoGroup({
    className,
    ...props
}: ComponentPropsWithRef<"div">) {
    return <div className={cn(classes.songInfo, className)} {...props} />
}

export function SongInfo({ id, online, ...props }: SongProps) {
    const songParams: SongParams = { id, online }

    return (
        <SongInfoGroup {...props}>
            <SongTitle {...songParams} />
            <SongArtist {...songParams} />
        </SongInfoGroup>
    )
}

export type SongLinkProps = ComponentPropsWithoutRef<"span"> & SongParams

export function SongTitle({
    id,
    online = false,
    className,
    ...props
}: SongLinkProps) {
    const { data: song } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: ({ title, albumId }) => ({ title, albumId }),
    })

    if (!song) return

    return song.albumId ? (
        <Link
            {...props}
            to="/album/$albumID"
            params={{ albumID: song.albumId }}
            className={className}
            onClick={(e) => e.stopPropagation()}
        >
            {song.title}
        </Link>
    ) : (
        <span {...props} className={className}>
            {song.title}
        </span>
    )
}

export function SongArtist({
    id,
    online = false,
    className,
    ...props
}: SongLinkProps) {
    const { data: song } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: ({ artist, artistId }) => ({ artist, artistId }),
    })

    if (!song || !song.artistId) return

    return song.artistId ? (
        <Link
            {...props}
            to="/artist/$artistID"
            params={{ artistID: song.artistId }}
            className={cn(classes.songArtist, className)}
            onClick={(e) => e.stopPropagation()}
        >
            {song.artist}
        </Link>
    ) : (
        <span {...props} className={cn(classes.songArtist, className)}>
            {song.artist}
        </span>
    )
}

export function FavoriteSong({ id, online }: SongParams) {
    const { data: starred, isPending: songIsPending } = useQuery({
        ...getSongOptions({ id }),
        enabled: online,
        select: (song) => !!song.starred,
    })

    const star = useMutateStar()
    const unstar = useMutateUnstar()

    function onClick() {
        if (starred) {
            unstar.mutate({ id })
        } else {
            star.mutate({ id })
        }
    }

    const isPending = star.isPending || unstar.isPending

    if (songIsPending) return

    return (
        <HeartIcon
            className={cn(
                classes.favorite,
                starred && classes.starred,
                isPending && classes.loading,
            )}
            onClick={onClick}
        />
    )
}
