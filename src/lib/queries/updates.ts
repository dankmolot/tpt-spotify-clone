// Optimistic updates live here
// TODO: set query data optimistically

import type { QueryClient } from "@tanstack/react-query"
import type { Child } from "../api/subsonic/schemas"

export async function updateSong(
    client: QueryClient,
    song: Partial<Child> & Pick<Child, "id">,
) {
    client.setQueryData(["getSong", song.id], (old?: Child) =>
        old ? { ...old, ...song } : old,
    )
}
