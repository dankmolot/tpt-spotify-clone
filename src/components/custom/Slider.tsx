import {
    type ComponentPropsWithRef,
    type CSSProperties,
    type MouseEvent,
    useEffect,
    useState,
} from "react"
import "./Slider.css"
import { cn } from "@/lib/utils"

type DivProps = ComponentPropsWithRef<"div">

interface SliderControllerProps extends DivProps {
    value?: number
    minValue?: number
    maxValue?: number
    step?: number
    onPressed?: () => void
    onUnpressed?: () => void
    onChanged?: (value: number) => void
    onChangedEnd?: (value: number) => void
}

export function Slider({ className, ...props }: SliderControllerProps) {
    // You can use this structure as example for your own hacks
    return (
        <SliderController {...props}>
            <SliderTrack>
                <SliderProgress />
            </SliderTrack>
            <SliderThumb />
        </SliderController>
    )
}

export function SliderController({
    value = 0,
    minValue = 0,
    maxValue = 100,
    step = 1,
    className,
    style,
    onPressed,
    onUnpressed,
    onChanged,
    onChangedEnd,
    ...props
}: SliderControllerProps) {
    const [currentValue, setCurrentValue] = useState(value)
    const [pressed, setPressed] = useState(false)

    const valueDelta = maxValue - minValue

    // sync given value with current state
    useEffect(() => {
        setCurrentValue(value)
    }, [value])

    function updateValue(e: MouseEvent) {
        const { x, width } = e.currentTarget.getBoundingClientRect()
        const delta =
            Math.min(Math.max(e.nativeEvent.pageX - x, 0), width) / width

        let newValue = minValue + valueDelta * delta
        if (step !== 0) {
            const remainder = newValue % step
            newValue = newValue - remainder + Math.round(remainder)
        }

        setCurrentValue(newValue)
        onChanged?.(newValue)
    }

    style = {
        ...style,
        "--sliderValue": Math.min(
            Math.max(minValue + currentValue / valueDelta, 0),
            1,
        ),
    } as CSSProperties

    return (
        <div
            role="slider"
            aria-valuenow={currentValue}
            aria-valuemin={minValue}
            aria-valuemax={maxValue}
            aria-disabled={valueDelta === 0}
            tabIndex={0}
            className={cn("slider", className)}
            onPointerMove={(e) => pressed && updateValue(e)}
            onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                setPressed(true)
                updateValue(e)
                onPressed?.()
            }}
            onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId)
                setPressed(false)
                onChangedEnd?.(currentValue)
                onUnpressed?.()
            }}
            style={style}
            {...props}
        ></div>
    )
}

export function SliderTrack({ className, ...props }: DivProps) {
    return <div className={cn("sliderTrack", className)} {...props} />
}

export function SliderProgress({ className, ...props }: DivProps) {
    return <div className={cn("sliderProgress", className)} {...props} />
}

export function SliderThumb({ className, ...props }: DivProps) {
    return <div className={cn("sliderThumb", className)} {...props} />
}
