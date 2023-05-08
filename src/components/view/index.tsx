import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    id: string
    children: any,
    width: string
}

export const View: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <div id={props.id} style={{ width: props.width }} className='view'>
            {props.children}
        </div>
    )
}
