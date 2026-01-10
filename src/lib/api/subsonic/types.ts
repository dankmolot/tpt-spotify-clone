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

export interface RequestOptions<Name extends RequestName> {
    serverURL: string
    auth: RequestUser | RequestToken | RequestApiKey
    params?: RequestParams[Name]
    signal?: AbortSignal
}


export interface RequestParams {
    "ping": never
    "getAlbumList2": GetAlbumList2
    "getCoverArt": GetCoverArtParams
    "stream": StreamParams
    "getAlbum": GetAlbumParams
    "getSong": GetSongParams
}
export type RequestName = keyof RequestParams


export interface GetAlbumList2 {
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

export interface GetCoverArtParams {
    id: string
    size?: number
}

export interface GetAlbumParams {
    id: string
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

export interface GetSongParams {
    /** The song ID. */
    id: string
}
