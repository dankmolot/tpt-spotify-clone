import clsx from "clsx";
import type React from "react";
import whiteLogo from "@/assets/spotify/logo-white.svg";
import classes from "./Logo.module.scss";

export interface LogoProps extends React.ComponentProps<"img"> {}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <img
            src={whiteLogo}
            alt="Spotify Logo"
            className={clsx([classes.logo, className])}
            {...props}
        />
    );
}
