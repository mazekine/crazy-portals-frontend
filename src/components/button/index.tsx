import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    type?: 'default' | 'outline' | 'secondory' | 'tentery',
    size?: 'm' | 'l',
    children?: any,
    stretched?: boolean,
    [x: string]: any
}

export const Button: React.FC<MainProps> = ({
    type = 'default',
    size = 'l',
    children,
    stretched = false,
    ...restProps
}: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <button {...restProps} className={
            `btn ${type}-btn ${size}-btn ${stretched ? 'stretched-btn' : ''}`
        }>
            {children}
        </button>
    )
}
