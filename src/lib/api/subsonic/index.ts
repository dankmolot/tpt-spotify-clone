import { hex } from "@/lib/utils"
import {
    GetAlbumList2Response,
    GetAlbumResponse,
    GetArtistInfo2Response,
    GetArtistResponse,
    GetPlaylistResponse,
    GetPlaylistsResponse,
    GetSongResponse,
    GetTopSongsResponse,
    SubsonicError,
    SubsonicResponse,
} from "./schemas"
import type { RequestName, RequestOptions } from "./types"

function requestURL<N extends RequestName>(
    name: N,
    options: RequestOptions<N>,
) {
    const url = new URL(`/rest/${name}`, options.serverURL)
    const params = url.searchParams

    // Params
    for (const key in options.params) {
        const value = options.params[key]
        params.set(key, value as string)
    }

    // Primary values
    params.set("f", "json") // format
    params.set("c", "Spotify Clone") // client name
    params.set("v", "1.16.1") // subsonic version

    // auth params
    if ("token" in options.auth) {
        // api key auth
        params.set("apiKey", options.auth.token)
    } else {
        // either cleartext or hashed
        params.set("u", options.auth.user)
        if ("hash" in options.auth) {
            // hashed
            params.set("t", options.auth.hash)
            params.set("s", options.auth.salt)
        } else {
            // cleartext
            params.set("p", `enc:${hex(options.auth.pass)}`)
        }
    }

    return url
}

async function request<N extends RequestName>(
    name: N,
    options: RequestOptions<N>,
): Promise<SubsonicResponse> {
    const url = requestURL(name, options)
    const r = await fetch(url, { signal: options.signal })

    if (r.headers.get("content-type")?.startsWith("application/json")) {
        const data = await r.json()
        if (!Object.hasOwn(data, "subsonic-response")) {
            throw new SubsonicError({
                code: 0,
                message: "server returned bad response",
            })
        }

        const info = SubsonicResponse.parse(data["subsonic-response"])
        if (info.status === "failed" || Object.hasOwn(info, "error")) {
            const err = SubsonicError.type.parse(info.error)
            err.info = info
            throw err
        }

        return info
    }

    throw new SubsonicError({
        code: 0,
        message: `expected json response, got ${r.headers.get("content-type")}`,
    })
}

export function ping(options: RequestOptions<"ping">) {
    return request("ping", options) as Promise<SubsonicResponse>
}

export function getAlbumList2(options: RequestOptions<"getAlbumList2">) {
    return request("getAlbumList2", options).then(
        (r) => GetAlbumList2Response.parse(r).albumList2.album,
    )
}

export function getCoverArt(options: RequestOptions<"getCoverArt">) {
    return requestURL("getCoverArt", options)
}

export function getAlbum(options: RequestOptions<"getAlbum">) {
    return request("getAlbum", options).then(
        (r) => GetAlbumResponse.parse(r).album,
    )
}

export function stream(options: RequestOptions<"stream">) {
    return requestURL("stream", options)
}

export function getSong(options: RequestOptions<"getSong">) {
    return request("getSong", options).then(
        (r) => GetSongResponse.parse(r).song,
    )
}

/** Attaches a star to a song, album or artist. */
export function star(options: RequestOptions<"star">) {
    return request("star", options)
}

/** Removes a star to a song, album or artist. */
export function unstar(options: RequestOptions<"unstar">) {
    return request("unstar", options)
}

/** Returns all playlists a user is allowed to play. */
export function getPlaylists(options: RequestOptions<"getPlaylists">) {
    return request("getPlaylists", options).then((r) => GetPlaylistsResponse.parse(r).playlists.playlist)
}

/** Returns details for an artist. */
export function getArtist(options: RequestOptions<"getArtist">) {
    return request("getArtist", options).then((r) => GetArtistResponse.parse(r).artist)
}

/** Returns details for an artist. */
export function getArtistInfo2(options: RequestOptions<"getArtistInfo2">) {
    return request("getArtistInfo2", options).then((r) => GetArtistInfo2Response.parse(r).artistInfo2)
}

/** Returns top songs for the given artist, using data from last.fm. */
export function getTopSongs(options: RequestOptions<"getTopSongs">) {
    return request("getTopSongs", options).then((r) => GetTopSongsResponse.parse(r).topSongs.song || [])
}

/** Returns a listing of files in a saved playlist. */
export function getPlaylist(options: RequestOptions<"getPlaylist">) {
    return request("getPlaylist", options).then((r) => GetPlaylistResponse.parse(r).playlist)
}