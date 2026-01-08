import { z } from "zod"
import { hex, md5 } from "@/lib/utils"

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

interface RequestOptions {
    serverURL: string
    auth: RequestUser | RequestToken | RequestApiKey
    params?: object
}

async function request<T>(
    name: string,
    parser: z.ZodType<T>,
    options: RequestOptions,
) {
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
    return fetch(url)
        .then((r) => r.json())
        .then((r) => parser.parse(r["subsonic-response"]))
}

export const SubsonicError = z.object({
    code: z.number(),
    message: z.string().optional(),
    helpUrl: z.string().optional(),
})

export const SubsonicResponseBase = z.object({
    version: z.string(),
    type: z.string(),
    serverVersion: z.string(),
    openSubsonic: z.boolean(),
})

export const SubsonicOkResponse = z.object({
    ...SubsonicResponseBase.shape,
    status: z.literal("ok"),
})

export const SubsonicErrorResponse = z.object({
    ...SubsonicResponseBase.shape,
    status: z.literal("failed"),
    error: SubsonicError,
})

function toResponse<T extends z.ZodRawShape>(shape: T) {
    return z.discriminatedUnion("status", [
        SubsonicOkResponse.extend(shape),
        SubsonicErrorResponse,
    ])
}

export const SubsonicResponse = toResponse({})

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

const salt = "test"
const hash = md5(`${import.meta.env.VITE_SUBSONIC_PASS}${salt}`)

const defaultOptions: RequestOptions = {
    serverURL: import.meta.env.VITE_SUBSONIC_URL,
    auth: { user: import.meta.env.VITE_SUBSONIC_USER, hash, salt },
}

export function ping() {
    return request("ping", SubsonicResponse, { ...defaultOptions })
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

const GetAlbumList2Response = toResponse({
    albumList2: z.object({
        album: z.array(AlbumID3),
    }),
})
export type GetAlbumList2Response = z.infer<typeof GetAlbumList2Response>

export function getAlbumList2(params: GetAlbumList2Params) {
    return request("getAlbumList2", GetAlbumList2Response, {
        ...defaultOptions,
        params,
    })
}
