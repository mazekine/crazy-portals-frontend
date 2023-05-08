import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    children?: any,
    before?: any,
    after?: any,
    width: string
}

export const Header: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <div className='header' >
            <div className='header-in' style={{ width: props.width }}>
                <span className='header-before'>
                    {props.before}
                </span>
                <span className='header-children'>
                    {props.children}
                </span>
                <span className='header-after'>
                    {props.after}
                </span>
            </div>

        </div>
    )
}

