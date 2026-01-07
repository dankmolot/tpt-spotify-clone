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
    auth: RequestUser | RequestToken | RequestApiKey
}

async function request<T>(name: string, parser: z.ZodType<T>, options: RequestOptions) {
    const params = new URLSearchParams({
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

    const url = `https://demo.navidrome.org/rest/${name}.view?${params.toString()}`
    return fetch(url).then((r) => r.json()).then(r => parser.parse(r["subsonic-response"]))
}

export const SubsonicError = z.object({
    "code": z.number(),
    "message": z.string().optional(),
    "helpUrl": z.string().optional(),
})

export const SubsonicResponseBase = z.object({
    "version": z.string(),
    "type": z.string(),
    "serverVersion": z.string(),
    "openSubsonic": z.boolean(),
})

export const SubsonicOkResponse = z.object({
    ...SubsonicResponseBase.shape,
    "status": z.literal("ok"),
})

export const SubsonicErrorResponse = z.object({
    ...SubsonicResponseBase.shape,
    "status": z.literal("failed"),
    "error": SubsonicError
})

export const SubsonicResponse = z.discriminatedUnion("status", [
    SubsonicOkResponse,
    SubsonicErrorResponse,
])

const salt = "test"
const hash = md5(`demo${salt}`)

const defaultOptions: RequestOptions = {
    auth: { user: "demo", hash, salt },
}

export function ping() {
    return request("ping", SubsonicResponse, { ...defaultOptions })
}
