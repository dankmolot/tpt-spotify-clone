import { z } from "zod"
import { hex, md5 } from "@/lib/utils"

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

function parse<I, O>(o: z.ZodType<I, O>) {
    return (data: unknown) => o.parse(data)
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

interface RequestOptions {
    serverURL: string
    auth: RequestUser | RequestToken | RequestApiKey
    params?: object
}

async function request(
    name: string,
    options: RequestOptions,
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
    const r = await fetch(url)
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
    return request("ping", defaultOptions) as Promise<SubsonicResponse>
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

export function getAlbumList2(params: GetAlbumList2Params) {
    return request("getAlbumList2", {
        ...defaultOptions,
        params,
    }).then(parse(GetAlbumList2Response)).then(r => r.albumList2.album)
}

export interface GetCoverArtParams {
    id: string
    size?: number
}

export function getCoverArt(params: GetCoverArtParams) {
    return request("getCoverArt", {
        ...defaultOptions,
        params,
    }) as Promise<Blob>
}
