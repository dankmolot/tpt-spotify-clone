import {
    TextField as AriaTextField,
    type TextFieldProps as AriaTextFieldProps,
    Input,
    type ValidationResult,
} from "react-aria-components"
import { Description, FieldError, Label } from "./Form.tsx"
import "./TextField.css"
import type { AnyFieldApi } from "@tanstack/react-form"

export interface TextFieldProps extends AriaTextFieldProps {
    label?: string
    description?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
    placeholder?: string
    field?: AnyFieldApi
}

export function TextField({
    label,
    description,
    errorMessage,
    placeholder,
    field,
    ...props
}: TextFieldProps) {
    if (field) {
        props.defaultValue = field.state.value
        props.onChange = (value) => field.handleChange(value)
        props.onBlur = field.handleBlur
    }

    return (
        <AriaTextField {...props}>
            <Label>{label}</Label>
            <Input
                className="react-aria-Input inset"
                placeholder={placeholder}
            />
            {description && <Description>{description}</Description>}
            {field?.state.meta.errors.map((error) => (
                <FieldError key={error.toString()}>{error}</FieldError>
            ))}

        </AriaTextField>
    )
}
