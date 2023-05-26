import React, { useEffect } from 'react'

import './style.css'

interface MainProps {
    children: any,
    header?: any,
    footer?: any,
    modal?: any
}

export const AppRoot: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <div id="app_root" className={'app_root'}>
            {props.header}
            <div className={`app_root_in ${props.header ? 'header-fix' : ''}`}>
                {props.children}
            </div>
            {props.footer}
            {props.modal ? <div className='modal-root'>
                {props.modal}
            </div> : null}
        </div>
    )
}
