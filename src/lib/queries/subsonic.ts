import {
    queryOptions,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"
import * as subsonic from "../api/subsonic"
import type { RequestParams } from "../api/subsonic/types"
import { md5 } from "../utils"
import { getSongKey } from "./keys"
import { setSong, updateSong } from "./updates"

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
        queryFn: ({ signal, client }) =>
            subsonic
                .getAlbum({ ...defaultOptions, signal, params })
                .then((album) => {
                    for (const song of album.song ?? []) {
                        setSong(client, song)
                    }
                    return album
                }),
    })

export const getSongOptions = (params: RequestParams["getSong"]) =>
    queryOptions({
        queryKey: getSongKey(params.id),
        queryFn: ({ signal }) =>
            subsonic.getSong({ ...defaultOptions, signal, params }),
    })

export const streamURL = (params: RequestParams["stream"]) =>
    subsonic.stream({ ...defaultOptions, params }).toString()

export const getCoverArtURL = (params: RequestParams["getCoverArt"]) =>
    subsonic.getCoverArt({ ...defaultOptions, params }).toString()

export const useMutateStar = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: RequestParams["star"]) =>
            subsonic.star({ ...defaultOptions, params }),
        onSuccess: (_, { id }) =>
            updateSong(queryClient, { id, starred: new Date() }),
    })
}

export const useMutateUnstar = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: RequestParams["unstar"]) =>
            subsonic.unstar({ ...defaultOptions, params }),
        onSuccess: (_, { id }) =>
            updateSong(queryClient, { id, starred: undefined }),
    })
}
