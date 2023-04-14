import clsx from 'clsx'

export type DividerType = 'horizontal' | 'vertical'

export interface DividerProps {
    variant?: DividerType
    className?: string
}

export default function Divider({
    variant = 'horizontal',
    className,
    ...props
}: DividerProps) {
const variantClasses= {
    horizontal: 'w-3/4 mx-auto h-px my-8 bg-neutral-100 opacity-100 dark:opacity-50 border-0 dark:bg-gray-700',
    vertical: 'inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50 border-0 dark:bg-gray-700'
}

    return (
        <hr className={clsx(variantClasses[variant], className)}
            { ...props }
        >
        </hr>


    )
}