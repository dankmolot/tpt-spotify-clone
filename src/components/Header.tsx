import { Link } from "./custom/Link"
import classes from "./Header.module.css"
import { Logo } from "./Logo"

export function Header() {
    return (
        <div className={classes.header}>
            <Link to="/" className={classes.logo}>
                <Logo />
            </Link>

            <div>search</div>
            <div>user</div>
        </div>
    )
}
