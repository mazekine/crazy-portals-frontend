import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    src: any,
    size?: 16 | 20 | 24 | 28 | 32 | 36 | 48,
    type?: 'default' | 'round'
    [x: string]: any
}

export const Icon: React.FC<MainProps> = ({
    src,
    size = 24,
    type = 'default',
    ...restProps
}: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <img src={src} {...restProps} className={`icon icon-${size} ${type}-icon`} />
    )
}
