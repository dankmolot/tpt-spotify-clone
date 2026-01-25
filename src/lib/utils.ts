import { type ClassValue, clsx } from "clsx"
import SparkMD5 from "spark-md5"

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// https://stackoverflow.com/a/57391629
export function hex(value: string) {
    return Array.from(
        new TextEncoder().encode(value),
        byte => byte.toString(16).padStart(2, "0")
    ).join("")
}

export function md5(value: string) {
    return SparkMD5.hash(value)
}

export function humanTime(raw: number) {
    const hours = Math.floor(raw / 60 / 60)
    const minutes = Math.floor((raw / 60) % 60)
    const seconds = Math.round(raw % 60)
        .toString()
        .padStart(2, "0")

    if (hours !== 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    }

    return `${minutes}:${seconds}`
}
