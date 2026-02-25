import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    type RowData,
    useReactTable,
} from "@tanstack/react-table"
import { ClockIcon, EllipsisIcon, PauseIcon, PlayIcon } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import type { Child } from "@/lib/api/subsonic/schemas"
import { usePlayerState } from "@/lib/state"
import { humanTime } from "@/lib/utils"
import { AlbumLink } from "../custom/Link"
import { SongItem } from "./Item"
import { FavoriteSong } from "./Song"
import classes from "./SongTable.module.css"

// https://tanstack.com/table/v8/docs/guide/custom-features
interface SongTableToggles {
    coverArt?: boolean
    albumLink?: boolean
    artists?: boolean
}

// define types for our new feature's table options
interface SongTableOptions {
    songTable?: SongTableToggles
}

// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module "@tanstack/react-table" {
    // or whatever framework adapter you are using
    //merge our new feature's options with the existing table options
    // biome-ignore lint/correctness/noUnusedVariables: it's okay
    interface TableOptionsResolved<TData extends RowData>
        extends SongTableOptions {}
}

const columnHelper = createColumnHelper<Child>()

const columns = [
    columnHelper.accessor("track", {
        header: () => <span className={classes.track}>#</span>,
        cell: (info) => {
            const [songID, playing, setPlaying] = usePlayerState(
                useShallow((s) => [s.songID, s.playing, s.setPlaying]),
            )

            return (
                <button
                    type="button"
                    className={classes.track}
                    onClick={() =>
                        songID === info.row.id && setPlaying(!playing)
                    }
                >
                    <span className={classes.trackNumber}>
                        {info.row.index + 1}
                    </span>
                    <PlayIcon className={classes.playIcon} />
                    <PauseIcon className={classes.pauseIcon} />
                </button>
            )
        },
    }),
    columnHelper.accessor("id", {
        id: "song",
        header: () => <span className={classes.song}>Title</span>,
        cell: (info) => (
            <SongItem
                song={info.row.original}
                className={classes.song}
                theme={{ artists: classes.artist }}
                disableCover={!info.table.options.songTable?.coverArt}
                disableAlbumLink={!info.table.options.songTable?.albumLink}
                disableArtists={!info.table.options.songTable?.artists}
            />
        ),
    }),
    columnHelper.accessor(({ album, albumId }) => ({ album, albumId }), {
        id: "album",
        header: () => <span className={classes.album}>Album</span>,
        cell: (info) => (
            <AlbumLink
                albumID={info.getValue().albumId}
                className={classes.album}
            >
                {info.getValue().album}
            </AlbumLink>
        ),
    }),
    columnHelper.accessor("playCount", {
        header: () => <div className={classes.playCount} />,
        cell: (info) => (
            <span className={classes.playCount}>{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor("id", {
        id: "favorite",
        header: () => <div className={classes.favorite}></div>,
        cell: (info) => (
            <div className={classes.favorite}>
                <FavoriteSong id={info.getValue()} />
            </div>
        ),
    }),
    columnHelper.accessor("duration", {
        header: () => (
            <div className={classes.duration}>
                <ClockIcon />
            </div>
        ),
        cell: (info) => (
            <span className={classes.duration}>
                {humanTime(info.getValue() ?? 0)}
            </span>
        ),
    }),
    columnHelper.accessor("id", {
        id: "options",
        header: () => <div className={classes.options} />,
        cell: (_info) => (
            <div className={classes.options}>
                <EllipsisIcon />
            </div>
        ),
    }),
]

export interface SongTableProps {
    songs?: Child[]
    /** limits how much songs are shown in the song table */
    limit?: number
    withCoverArt?: boolean
    withArtists?: boolean
    withAlbum?: boolean
    withPlayCount?: boolean
    withHeader?: boolean
}

export function SongTable({
    songs,
    limit: showLimit,
    withCoverArt = false,
    withArtists = false,
    withAlbum = false,
    withPlayCount = false,
    withHeader = false,
}: SongTableProps) {
    const table = useReactTable({
        data: songs ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        songTable: {
            coverArt: withCoverArt,
            albumLink: true,
            artists: withArtists,
        },
        state: {
            columnVisibility: {
                album: withAlbum,
                playCount: withPlayCount,
            },
        },
    })

    const [songID, playing, setSongID, setQueue, setPlaying] = usePlayerState(
        useShallow((s) => [
            s.songID,
            s.playing,
            s.setSongID,
            s.setQueue,
            s.setPlaying,
        ]),
    )

    const selectSong = (selectedID: string) => {
        const songIDs = table.getRowModel().rows.map((row) => row.id)
        setQueue(songIDs)
        setSongID(selectedID)
        setPlaying(true)
    }

    return (
        <div className={classes.songTable}>
            {/* spotify gave up using tables here, I gave up too. Welcome to the div hell */}
            {withHeader && (
                <div className={classes.header}>
                    {table
                        .getFlatHeaders()
                        .filter((header) => header.column.getIsVisible())
                        .map((header) =>
                            header.isPlaceholder ? (
                                <div key={header.id}></div>
                            ) : (
                                flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                )
                            ),
                        )}
                </div>
            )}
            <div className={classes.body}>
                {table
                    .getRowModel()
                    .rows.slice(0, showLimit)
                    .map((row) => (
                        // biome-ignore lint/a11y/useSemanticElements: this element contains interactive elements inside, if <button> used, will result in hydration error
                        <div
                            role="button"
                            tabIndex={0}
                            key={row.id}
                            className={classes.row}
                            onDoubleClick={() => selectSong(row.id)}
                            onKeyUp={() => selectSong(row.id)}
                            {...(songID === row.id && {
                                "data-selected": true,
                                "data-playing": playing,
                            })}
                        >
                            {row
                                .getVisibleCells()
                                .map((ceil) =>
                                    flexRender(
                                        ceil.column.columnDef.cell,
                                        ceil.getContext(),
                                    ),
                                )}
                        </div>
                    ))}
            </div>
        </div>
    )
}
