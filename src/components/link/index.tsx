import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    children?: any,
    [x: string]: any
}

export const Link: React.FC<MainProps> = ({
    children,
    ...restProps
}: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (

        <a className='link' {...restProps} >
            {children}
        </a>

    )
}
