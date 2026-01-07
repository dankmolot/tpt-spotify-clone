import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { SubmitButton } from "@/components/Button"
import { TextField } from "@/components/TextField"

export const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
    },
    formComponents: {
        SubmitButton: SubmitButton,
    },
    fieldContext,
    formContext,
})
