import { z } from "zod"
import { hex } from "@/lib/utils"

const SubsonicResponse = z.looseObject({
    version: z.string(),
    type: z.string(),
    serverVersion: z.string(),
    openSubsonic: z.boolean(),
    status: z.enum(["ok", "failed"]),
})
export type SubsonicResponse = z.infer<typeof SubsonicResponse>

class SubsonicError extends Error {
    static schema = z.object({
        code: z.number(),
        message: z.string().optional(),
        helpUrl: z.string().optional(),
    })
    static type = SubsonicError.schema.pipe(
        z.transform((e) => new SubsonicError(e)),
    )

    code: number
    helpURL?: string
    info?: z.infer<typeof SubsonicResponse>

    constructor(
        e: z.infer<typeof SubsonicError.schema>,
        options?: ErrorOptions,
    ) {
        let message = e.message
        if (e.code !== 0) {
            message = `${e.message} [${e.code}]`
        }

        super(message, options)

        this.name = "SubsonicError"
        this.code = e.code
        this.helpURL = e.helpUrl
    }
}

interface RequestUser {
    user: string
    pass: string
}

interface RequestToken {
    user: string
    hash: string
    salt: string
}

interface RequestApiKey {
    token: string
}

interface RequestOptions<P extends object> {
    serverURL: string
    auth: RequestUser | RequestToken | RequestApiKey
    params?: P
    signal?: AbortSignal
}

async function request<P extends object>(
    name: string,
    options: RequestOptions<P>,
): Promise<Blob | SubsonicResponse> {
    const params = new URLSearchParams({
        ...options.params,
        f: "json",
        c: "Spotify Clone",
        v: "1.16.1",
    })

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

    const url = `${options.serverURL}/rest/${name}.view?${params.toString()}`
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

    return r.blob()
}

const ArtistID3 = z.object({
    id: z.string(),
    name: z.string(),
    coverArt: z.string().optional(),
    artistImageUrl: z.string().optional(),
    starred: z.string().pipe(z.coerce.date()).optional(),
    musicBrainzId: z.string().optional(),
    sortName: z.string().optional(),
    roles: z.array(z.string()).optional(),
})
export type ArtistID3 = z.infer<typeof ArtistID3>

const ItemGenre = z.object({
    name: z.string(),
})
export type ItemGenre = z.infer<typeof ItemGenre>

const Contributor = z.object({
    role: z.string(),
    subRole: z.string().optional(),
    artist: ArtistID3,
})
export type Contributor = z.infer<typeof Contributor>

const ReplayGain = z.object({
    trackGain: z.number().optional(),
    albumGain: z.number().optional(),
    trackPeak: z.number().optional(),
    albumPeak: z.number().optional(),
    baseGain: z.number().optional(),
    fallbackGain: z.number().optional(),
})

const Child = z.object({
    id: z.string(),
    parent: z.string().optional(),
    isDir: z.boolean(),
    title: z.string(),
    album: z.string().optional(),
    artist: z.string().optional(),
    track: z.number().optional(),
    year: z.number().optional(),
    genre: z.string().optional(),
    coverArt: z.string().optional(),
    size: z.number().optional(),
    contentType: z.string().optional(),
    suffix: z.string().optional(),
    transcodedContentType: z.string().optional(),
    transcodedSuffix: z.string().optional(),
    duration: z.number().optional(),
    bitRate: z.number().optional(),
    samplingRate: z.number().optional(),
    path: z.string().optional(),
    isVideo: z.boolean().optional(),
    userRating: z.number().optional(),
    averateRating: z.number().optional(),
    playCount: z.number().optional(),
    discNumber: z.number().optional(),
    created: z.string().pipe(z.coerce.date()).optional(),
    starred: z.string().pipe(z.coerce.date()).optional(),
    albumId: z.string().optional(),
    artistId: z.string().optional(),
    type: z.enum(["music", "podcast", "audiobook", "video"]).optional(),
    mediaType: z.enum(["song", "album", "artist"]).optional(),
    bookmarkPosition: z.number().optional(),
    played: z.string().pipe(z.coerce.date()).optional(),
    bpm: z.number().optional(),
    comment: z.string().optional(),
    sortName: z.string().optional(),
    musicBrainzId: z.string().optional(),
    isrc: z.array(z.string()).optional(),
    genres: z.array(ItemGenre).optional(),
    artists: z.array(ArtistID3).optional(),
    displayArtist: z.string().optional(),
    albumArtists: z.array(ArtistID3).optional(),
    displayAlbumArtist: z.string().optional(),
    contributors: z.array(Contributor).optional(),
    displayComposer: z.string().optional(),
    moods: z.array(z.string()).optional(),
    replayGain: ReplayGain.optional(),
    explicitStatus: z.string().optional(),
})
export type Child = z.infer<typeof Child>

const AlbumID3 = z.object({
    id: z.string(),
    name: z.string(),
    version: z.string().optional(),
    artist: z.string().optional(),
    artistId: z.string().optional(),
    coverArt: z.string().optional(),
    songCount: z.number(),
    duration: z.number(),
    playCount: z.number().optional(),
    created: z.string().pipe(z.coerce.date()),
    starred: z.string().pipe(z.coerce.date()).optional(),
    year: z.number().optional(),
    genre: z.string().optional(),
    artists: z.array(ArtistID3).optional(),
})
export type AlbumID3 = z.infer<typeof AlbumID3>

const AlbumID3WithSongs = z.object({
    ...AlbumID3.shape,
    song: z.array(Child).optional(),
})
export type AlbumID3WithSongs = z.infer<typeof AlbumID3WithSongs>

export function ping(options: RequestOptions<never>) {
    return request("ping", options) as Promise<SubsonicResponse>
}

export interface GetAlbumList2Params {
    // byYear and byGenre is missing
    type:
    | "random"
    | "newest"
    | "highest"
    | "frequent"
    | "recent"
    | "alphabeticalByName"
    | "alphabeticalByArtist"
    | "starred"
    size?: number
    offset?: number
}

const GetAlbumList2Response = z.object({
    albumList2: z.object({
        album: z.array(AlbumID3),
    }),
})
export type GetAlbumList2Response = z.infer<typeof GetAlbumList2Response>

export function getAlbumList2(options: RequestOptions<GetAlbumList2Params>) {
    return request("getAlbumList2", options).then(
        (r) => GetAlbumList2Response.parse(r).albumList2.album,
    )
}

export interface GetCoverArtParams {
    id: string
    size?: number
}

export function getCoverArt(options: RequestOptions<GetCoverArtParams>) {
    return request("getCoverArt", options) as Promise<Blob>
}

export interface GetAlbumParams {
    id: string
}

const GetAlbumResponse = z.object({
    album: AlbumID3WithSongs,
})
export type GetAlbumResponse = z.infer<typeof GetAlbumResponse>

export function getAlbum(options: RequestOptions<GetAlbumParams>) {
    return request("getAlbum", options).then(
        (r) => GetAlbumResponse.parse(r).album,
    )
}

export interface StreamParams {
    /** A string which uniquely identifies the file to stream. Obtained by calls to getMusicDirectory. */
    id: string
    /** If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed. */
    maxBitRate?: number
    /** Specifies the preferred target format (e.g., “mp3” or “flv”) in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value “raw” to disable transcoding. */
    format?: string
    /** By default only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the media. The Transcode Offset extension enables the parameter to music too. */
    timeOffset?: number
    /** If set to “true”, the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media. */
    estimateContentLength?: boolean
}

export function stream(options: RequestOptions<StreamParams>) {
    return request("stream", options) as Promise<Blob>
}

export interface GetSongParams {
    /** The song ID. */
    id: string
}

const GetSongResponse = z.object({
    song: Child
})
export type GetSongResponse = z.infer<typeof GetSongResponse>

export function getSong(options: RequestOptions<GetSongParams>) {
    return request("getSong", options).then(r => GetSongResponse.parse(r).song)
}
