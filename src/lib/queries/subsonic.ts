import { useMutation } from "@tanstack/react-query";
import * as api from "@/lib/api"

export function ping() {
    return useMutation({
        mutationFn: () => api.subsonic.ping()
    })
}
