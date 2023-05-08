import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    id: string
    children: any,
    [x: string]: any
}

export const Panel: React.FC<MainProps> = ({
    id,
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
        <div id={id} {...restProps} className='panel'>
            {children}
        </div>
    )
}
