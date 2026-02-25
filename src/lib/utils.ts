import { type ClassValue, clsx } from "clsx"
import SparkMD5 from "spark-md5"

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

// https://stackoverflow.com/a/57391629
export function hex(value: string) {
    return Array.from(new TextEncoder().encode(value), (byte) =>
        byte.toString(16).padStart(2, "0"),
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

export function humanDuration(raw: number) {
    const seconds = Math.round(raw % 60)
    const minutes = Math.floor((raw / 60) % 60)
    const hours = Math.floor(raw / 60 / 60)

    const result = []
    hours && result.push(`${hours} hr`)
    minutes && result.push(`${minutes} min`)
    result.push(`${seconds} sec`)

    return result.join(" ")
}

/**
 * Basically transforms a "seed" value to a number in range from 0 to 1
 * Based on https://stackoverflow.com/a/23304189
 * @param seed number from which random is generated
 */
export function randomWithSeed(seed: number) {
    seed = Math.sin(seed) * 10000
    return seed - Math.floor(seed)
}

/**
 * Shuffle for arrays with a seed, useful for determinitsic results with same seeds
 * Shuffling based on https://stackoverflow.com/a/46545530
 */
export function shuffleArray<T>(input: T[], seed: number) {
    return input
        .map((value, i) => ({ value, sort: randomWithSeed(seed + i) }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

/** Converts "a cool dude" string to "A Cool Dude" */
export function toTitleCase(input: string): string {
    return input.split(" ").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ")
}