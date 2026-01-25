import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ClockIcon } from "lucide-react"
import type { Child } from "@/lib/api/subsonic/schemas"
import { humanTime } from "@/lib/utils"
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
    columnHelper.accessor("id", {
        id: "song",
        header: () => <span>Song</span>,
        cell: (info) => (
            <SongGroup id={info.getValue()} style={{ height: "4em" }}>
                <SongCover id={info.getValue()} />
                <SongInfoGroup>
                    <SongTitle id={info.getValue()} />
                    <SongArtist
                        id={info.getValue()}
                        className={classes.artist}
                    />
                </SongInfoGroup>
            </SongGroup>
        ),
    }),
    columnHelper.accessor("id", {
        id: "favorite",
        header: () => null,
        cell: (info) => <FavoriteSong id={info.getValue()} />,
    }),
    columnHelper.accessor("duration", {
        header: () => <ClockIcon />,
        cell: (info) => <span>{humanTime(info.getValue() ?? 0)}</span>,
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
    })

    return (
        <div className="p-2">
            <table style={{ width: "100%" }}>
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
                        <tr key={row.id} className={classes.song}>
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
            </table>
        </div>
    )
}
