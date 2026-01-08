import { useEffect, useState } from "react";

export function useBlob(blob?: Blob) {
    const [blobURL, setBlobURL] = useState<string | undefined>()
    useEffect(() => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        setBlobURL(url)

        return () => URL.revokeObjectURL(url)
    }, [blob])

    return blobURL
}
