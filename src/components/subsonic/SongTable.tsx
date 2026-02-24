import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ClockIcon, EllipsisIcon, PauseIcon, PlayIcon } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import type { Child } from "@/lib/api/subsonic/schemas"
import { usePlayerState } from "@/lib/state"
import { humanTime } from "@/lib/utils"
import { Link } from "../custom/Link"
import {
    FavoriteSong,
    SongArtist,
    SongCover,
    SongGroup,
    SongInfoGroup,
    SongTitle,
} from "./Song"
import classes from "./SongTable.module.css"

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
            <SongGroup id={info.getValue()} className={classes.song}>
                <SongCover id={info.getValue()} />
                <SongInfoGroup>
                    <SongTitle id={info.getValue()} className={classes.title} />
                    <SongArtist
                        id={info.getValue()}
                        className={classes.artist}
                    />
                </SongInfoGroup>
            </SongGroup>
        ),
    }),
    columnHelper.accessor("album", {
        header: () => <span className={classes.album}>Album</span>,
        cell: (info) => (
            <Link
                to="/album/$albumID"
                params={{ albumID: info.row.original.albumId || "" }}
                className={classes.album}
            >
                {info.getValue()}
            </Link>
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
}

export function SongTable({ songs }: SongTableProps) {
    const table = useReactTable({
        data: songs ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })

    const [songID, playing, setSongID, setQueue] = usePlayerState(
        useShallow((s) => [s.songID, s.playing, s.setSongID, s.setQueue]),
    )

    return (
        <div className={classes.songTable}>
            {/* spotify gave up using tables here, I gave up too. Welcome to the div hell */}
            <div className={classes.header}>
                {table
                    .getFlatHeaders()
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
            <div className={classes.body}>
                {table.getRowModel().rows.map((row) => (
                    <button
                        key={row.id}
                        className={classes.row}
                        onClick={() => {
                            const songIDs = table
                                .getRowModel()
                                .rows.map((row) => row.id)
                            setQueue(songIDs)

                            if (row.id !== songID) {
                                setSongID(row.id)
                            }
                        }}
                        type="button"
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
                    </button>
                ))}
            </div>
            {/* <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => {
                                setSongID(row.id)
                                setQueue(
                                    table
                                        .getRowModel()
                                        .rows.map((row) => row.id),
                                )
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    )
}
