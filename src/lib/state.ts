import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface PlayerState {
    songID: string
    setSong: (id: string) => void
}

export const usePlayerState = create<PlayerState>()(
    devtools(
        (set) => ({
            songID: "",
            setSong: (id) => set({ songID: id }),
        }),
        { name: "Player" },
    ),
)
