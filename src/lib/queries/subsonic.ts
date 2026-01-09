import { queryOptions } from "@tanstack/react-query"
import * as subsonic from "../api/subsonic"
import { md5 } from "../utils"

const salt = "test"
const hash = md5(`${import.meta.env.VITE_SUBSONIC_PASS}${salt}`)

export const defaultOptions = {
    serverURL: import.meta.env.VITE_SUBSONIC_URL,
    auth: { user: import.meta.env.VITE_SUBSONIC_USER, hash, salt },
}

export const getAlbumList2Options = (params: subsonic.GetAlbumList2Params) =>
    queryOptions({
        queryKey: ["getAlbumList2", params],
        queryFn: ({ signal }) =>
            subsonic.getAlbumList2({ ...defaultOptions, signal, params }),
    })

export const getCoverArtOptions = (params: subsonic.GetCoverArtParams) =>
    queryOptions({
        queryKey: ["getCoverArt", params],
        queryFn: ({ signal }) =>
            subsonic.getCoverArt({ ...defaultOptions, signal, params }),
        staleTime: Infinity,
    })

export const getAlbumOption = (params: subsonic.GetAlbumParams) =>
    queryOptions({
        queryKey: ["getAlbum", params.id],
        queryFn: ({ signal }) =>
            subsonic.getAlbum({ ...defaultOptions, signal, params }),
    })
