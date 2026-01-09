import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { SubmitButton } from "@/components/aria/Button"
import { TextField } from "@/components/aria/TextField"

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
