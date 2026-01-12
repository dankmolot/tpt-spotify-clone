// Optimistic updates live here
// TODO: set query data optimistically

import type { QueryClient } from "@tanstack/react-query"
import type { Child } from "../api/subsonic/schemas"

export async function updateSong(client: QueryClient, song: Child) {
    await client.invalidateQueries({ queryKey: ["getSong", song.id] })
    if (song.albumId) {
        // no need to wait for album updates currently
        client.invalidateQueries({ queryKey: ["getAlbum", song.albumId] })
    }
}
