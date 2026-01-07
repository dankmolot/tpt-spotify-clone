import {
    composeRenderProps,
    Button as RACButton,
    type ButtonProps as RACButtonProps,
} from "react-aria-components"
import { ProgressCircle } from "./ProgressCircle.tsx"
import "./Button.css"

interface ButtonProps extends RACButtonProps {
    /**
     * The visual style of the button (Vanilla CSS implementation specific).
     * @default 'primary'
     */
    variant?: "primary" | "secondary" | "quiet"
}

export function Button(props: ButtonProps) {
    return (
        <RACButton
            {...props}
            className="react-aria-Button button-base"
            data-variant={props.variant || "primary"}
        >
            {composeRenderProps(props.children, (children, { isPending }) => (
                <>
                    {!isPending && children}
                    {isPending && (
                        <ProgressCircle
                            aria-label="Saving..."
                            isIndeterminate
                        />
                    )}
                </>
            ))}
        </RACButton>
    )
}

export function SubmitButton(props: ButtonProps) {
    return <Button type="submit" {...props} />
}
