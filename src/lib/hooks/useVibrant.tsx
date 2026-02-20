import type { Palette, Swatch } from "@vibrant/color"
import type { ImageSource } from "@vibrant/image"
import { Vibrant } from "node-vibrant/browser"
import { useEffect, useState } from "react"

export type { Palette, Swatch, ImageSource }

export function useVibrant(imageSource?: ImageSource) {
    const [palette, setPalette] = useState<Palette | undefined>()

    useEffect(() => {
        if (!imageSource) {
            setPalette(undefined)
            return
        }

        Vibrant.from(imageSource).getPalette().then(setPalette)
    }, [imageSource])

    return palette
}
