import { create } from "zustand"

interface PlayerState {
    songID: string
    setSong: (id: string) => void
}

export const usePlayerState = create<PlayerState>()((set) => ({
    songID: "",
    setSong: (id) => set({ songID: id }),
}))
