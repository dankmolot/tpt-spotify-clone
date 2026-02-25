import type { ReactNode } from "react"

export interface PassthroughProps {
    children?: ReactNode
}

export function Passthrough({ children }: PassthroughProps) {
    return children
}
