import { RawLink } from "./aria/Link"
import classes from "./Header.module.css"
import { Logo } from "./Logo"

export function Header() {
    return (
        <div className={classes.header}>
            <RawLink to="/" className={classes.logo}>
                <Logo />
            </RawLink>

            <div>search</div>
            <div>user</div>
        </div>
    )
}
