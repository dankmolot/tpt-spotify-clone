import { useMutation, useQuery } from "@tanstack/react-query"
import * as subsonic from "../api/subsonic"

export function ping() {
    return useMutation({
        mutationFn: () => subsonic.ping(),
    })
}

export function getAlbumList2(params: subsonic.GetAlbumList2Params) {
    return useQuery({
        queryKey: ["getAlbumList2"],
        queryFn: () => subsonic.getAlbumList2(params),
    })
}
