import { getCoverArtURL } from "@/lib/queries/subsonic"

export interface ConverArtProps
    extends Omit<React.ComponentPropsWithRef<"img">, "children"> {
    /** Cover art ID, do not use song ID, album ID or etc. */
    id?: string
}

export function CoverArt({ id, ...props }: ConverArtProps) {
    const coverArtURL = getCoverArtURL({ id: id ?? "" })

    // to reload img, set its .src to a value
    // setting .src will trigger a reload

    const onError = (element: HTMLImageElement) => {
        const newURL = getCoverArtURL({ id: "" })
        if (element.src !== newURL) {
            element.src = newURL
        }
    }

    return (
        <img
            aria-label="Cover Art"
            src={coverArtURL}
            loading="lazy"
            crossOrigin="anonymous"
            onError={({ currentTarget }) => onError(currentTarget)}
            {...props}
        />
    )
}

// reference was taken from Navidrome navigator.mediaSession.metadata.artwork
// const IMAGE_SIZES = [96, 128, 192, 256, 384, 512]

// function generateSrcSet() {

// }
