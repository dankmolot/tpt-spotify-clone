import { HomeIcon, SearchIcon, UserIcon } from "lucide-react"
import { Link } from "./custom/Link"
import classes from "./Header.module.css"
import { Logo } from "./Logo"

export function Header() {
    return (
        <div className={classes.header}>
            <Link to="/" raw className={classes.logo}>
                <Logo />
            </Link>

            <div className={classes.middle}>
                <Link to="/" raw className={classes.home}>
                    <HomeIcon />
                </Link>
                <div className={classes.search}>
                    <SearchIcon className={classes.icon} />
                    <span className={classes.placeholder}>
                        What do you want to play?
                    </span>
                </div>
            </div>

            <div className={classes.user}>
                <UserIcon />
            </div>
        </div>
    )
}
