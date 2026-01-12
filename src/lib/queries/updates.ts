// Optimistic updates live here
// TODO: set query data optimistically

import type { QueryClient } from "@tanstack/react-query"
import type { Child } from "../api/subsonic/schemas"

export function updateSong(client: QueryClient, song: Child) {
    client.invalidateQueries({ queryKey: ["getSong", song.id] })
    if (song.albumId) {
        client.invalidateQueries({ queryKey: ["getAlbum", song.albumId] })
    }
}
