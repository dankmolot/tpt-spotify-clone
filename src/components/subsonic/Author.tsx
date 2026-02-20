import { Link } from "../custom/Link"
import classes from "./Author.module.css"
import { CoverArt } from "./CoverArt"

export interface AuthorProps {
    id: string
    name: string
    coverID?: string
}

export function Author({ id, name, coverID, ...props }: AuthorProps) {
    return (
        <span className={classes.author} {...props}>
            {coverID && <CoverArt id={coverID} className={classes.coverArt} />}
            <Link to="/artist/$artistID" params={{ artistID: id }}>
                {name}
            </Link>
        </span>
    )
}
