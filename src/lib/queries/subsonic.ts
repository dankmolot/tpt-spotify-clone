import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import * as subsonic from "../api/subsonic"

export function usePing() {
    return useMutation({
        mutationFn: () => subsonic.ping(),
    })
}

export function useGetAlbumList2(params: subsonic.GetAlbumList2Params) {
    return useQuery({
        queryKey: ["getAlbumList2"],
        queryFn: () => subsonic.getAlbumList2(params),
    })
}

export function useGetCoverArt(params?: subsonic.GetCoverArtParams) {
    return useQuery({
        queryKey: ["getCoverArt", params?.id, params?.size],
        queryFn: params ? () => subsonic.getCoverArt(params) : skipToken,
    })
}
