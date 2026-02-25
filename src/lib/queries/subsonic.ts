import {
    type QueryClient,
    queryOptions,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"
import * as subsonic from "../api/subsonic"
import type { Child } from "../api/subsonic/schemas"
import type { RequestParams } from "../api/subsonic/types"
import { md5 } from "../utils"
import { getSongKey } from "./keys"
import { setSong, updateSong } from "./updates"

const salt = "test"
const hash = md5(`${import.meta.env.VITE_SUBSONIC_PASS}${salt}`)

const defaultOptions = {
    serverURL: import.meta.env.VITE_SUBSONIC_URL,
    auth: { user: import.meta.env.VITE_SUBSONIC_USER, hash, salt },
}

function cacheSongs(client: QueryClient, songs?: Child[]) {
    if (songs) {
        for (const song of songs) {
            setSong(client, song)
        }
    }

    return songs
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
                    cacheSongs(client, album.song)
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

export const getPlaylistsOptions = (params?: RequestParams["getPlaylists"]) =>
    queryOptions({
        queryKey: ["getPlaylists", params],
        queryFn: ({ signal }) =>
            subsonic.getPlaylists({ ...defaultOptions, signal, params }),
    })

export const getArtistOptions = (params?: RequestParams["getArtist"]) =>
    queryOptions({
        queryKey: ["getArtist", params],
        queryFn: ({ signal }) =>
            subsonic.getArtist({ ...defaultOptions, signal, params }),
    })

export const getArtistInfo2Options = (
    params?: RequestParams["getArtistInfo2"],
) =>
    queryOptions({
        queryKey: ["getArtistInfo2", params],
        queryFn: ({ signal }) =>
            subsonic.getArtistInfo2({ ...defaultOptions, signal, params }),
    })

export const getTopSongsOptions = (params?: RequestParams["getTopSongs"]) =>
    queryOptions({
        queryKey: ["getTopSongs", params],
        queryFn: ({ signal, client }) =>
            subsonic
                .getTopSongs({ ...defaultOptions, signal, params })
                .then((s) => cacheSongs(client, s)),
    })

export const getPlaylistOptions = (params?: RequestParams["getPlaylist"]) =>
    queryOptions({
        queryKey: ["getPlaylist", params],
        queryFn: ({ signal, client }) =>
            subsonic
                .getPlaylist({ ...defaultOptions, signal, params })
                .then((p) => {
                    cacheSongs(client, p.entry)
                    return p
                }),
    })
