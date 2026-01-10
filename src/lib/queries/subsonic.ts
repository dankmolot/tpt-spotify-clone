import { queryOptions } from "@tanstack/react-query"
import { useMemo } from "react"
import * as subsonic from "../api/subsonic"
import type { RequestParams } from "../api/subsonic/types"
import { md5 } from "../utils"

const salt = "test"
const hash = md5(`${import.meta.env.VITE_SUBSONIC_PASS}${salt}`)

export const defaultOptions = {
    serverURL: import.meta.env.VITE_SUBSONIC_URL,
    auth: { user: import.meta.env.VITE_SUBSONIC_USER, hash, salt },
}

export const getAlbumList2Options = (params: RequestParams["getAlbumList2"]) =>
    queryOptions({
        queryKey: ["getAlbumList2", params],
        queryFn: ({ signal }) =>
            subsonic.getAlbumList2({ ...defaultOptions, signal, params }),
    })

export const getAlbumOptions = (params: RequestParams["getAlbum"]) =>
    queryOptions({
        queryKey: ["getAlbum", params.id],
        queryFn: ({ signal }) =>
            subsonic.getAlbum({ ...defaultOptions, signal, params }),
    })

export const getSongOptions = (params: RequestParams["getSong"]) =>
    queryOptions({
        queryKey: ["getSong", params.id],
        queryFn: ({ signal }) =>
            subsonic.getSong({ ...defaultOptions, signal, params }),
    })

export const streamURL = (params: RequestParams["stream"]) =>
    useMemo(() => subsonic.stream({ ...defaultOptions, params }), [params])

export const getCoverArtURL = (params: RequestParams["getCoverArt"]) =>
    useMemo(() => subsonic.getCoverArt({ ...defaultOptions, params }), [params])
