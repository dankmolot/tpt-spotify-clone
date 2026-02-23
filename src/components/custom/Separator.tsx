import type { ComponentPropsWithRef } from "react";

export function Separator(props: Omit<ComponentPropsWithRef<"span">, "children">) {
    return <span {...props}> • </span>
}