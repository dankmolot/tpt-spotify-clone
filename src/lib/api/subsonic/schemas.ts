import z from "zod"

export const SubsonicResponse = z.looseObject({
    version: z.string(),
    type: z.string(),
    serverVersion: z.string(),
    openSubsonic: z.boolean(),
    status: z.enum(["ok", "failed"]),
})
export type SubsonicResponse = z.infer<typeof SubsonicResponse>


export class SubsonicError extends Error {
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
export type ReplayGain = z.infer<typeof ReplayGain>


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
    duration: z.number().default(0), // required by spec, navidrome sometime returns nothing
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


const ArtistWithAlbumsID3 = z.object({
    ...ArtistID3.shape,
    album: z.array(AlbumID3).optional()
})
export type ArtistWithAlbumsID3 = z.infer<typeof ArtistWithAlbumsID3>


const Playlist = z.object({
    id: z.string(),
    name: z.string(),
    comment: z.string().optional(),
    owner: z.string().optional(),
    public: z.boolean().optional(),
    songCount: z.number(),
    duration: z.number(),
    created: z.string().pipe(z.coerce.date()),
    changed: z.string().pipe(z.coerce.date()),
    coverArt: z.string().optional(),
    allowedUser: z.array(z.string()).optional(),
    readonly: z.boolean().optional(),
    validUntil: z.string().pipe(z.coerce.date()).optional(),
})
export type Playlist = z.infer<typeof Playlist>


const ArtistInfo2 = z.object({
    biography: z.string().optional(),
    musicBrainzId: z.string().optional(),
    lastFmUrl: z.string().optional(),
    smallImageUrl: z.string().optional(),
    mediumImageUrl: z.string().optional(),
    largeImageUrl: z.string().optional(),
    similarArtist: z.array(ArtistID3).optional(),
})
export type ArtistInfo2 = z.infer<typeof ArtistInfo2>


export const GetAlbumList2Response = z.object({
    albumList2: z.object({
        album: z.array(AlbumID3),
    }),
})
export type GetAlbumList2Response = z.infer<typeof GetAlbumList2Response>


export const GetAlbumResponse = z.object({
    album: AlbumID3WithSongs,
})
export type GetAlbumResponse = z.infer<typeof GetAlbumResponse>


export const GetSongResponse = z.object({
    song: Child
})
export type GetSongResponse = z.infer<typeof GetSongResponse>


export const GetPlaylistsResponse = z.object({
    playlists: z.object({
        playlist: z.array(Playlist)
    })
})
export type GetPlaylistsResponse = z.infer<typeof GetPlaylistsResponse>


export const GetArtistResponse = z.object({
    artist: ArtistWithAlbumsID3
})
export type GetArtistResponse = z.infer<typeof GetArtistResponse>


export const GetArtistInfo2Response = z.object({
    artistInfo2: ArtistInfo2
})
export type GetArtistInfo2Response = z.infer<typeof GetArtistInfo2Response>