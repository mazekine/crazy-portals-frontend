import React, { MouseEventHandler, useEffect } from 'react'

import { Oval } from 'react-loader-spinner'
import './style.css'

interface MainProps {
    type?: 'default' | 'outline' | 'secondory' | 'tentery',
    size?: 'm' | 'l',
    children?: any,
    stretched?: boolean,
    load?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement>
    [x: string]: any
}

export const Button: React.FC<MainProps> = ({
    type = 'default',
    size = 'l',
    children,
    stretched = false,
    load = false,
    onClick = () => null,
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
            `btn ${type}-btn ${size}-btn ${stretched ? 'stretched-btn' : ''} ${load ? ' load-btn' : ''}`
        } onClick={!load ? onClick : () => null}>
            {load ? <Oval
                height={20}
                width={20}
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#eee"
                strokeWidth={4}
                strokeWidthSecondary={4}

            /> : null}
            {children}
        </button>
    )
}
