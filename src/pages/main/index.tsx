import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './style.css'
import { Panel, Div, Button } from '../../components'

import imgBoard from '../../img/Playable.svg'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean
}

export const Main: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const history = useNavigate()

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <Panel id={props.id}>
            <Div className="panel-main" style={props.isDesktop ? {} : { flexDirection: 'column' }}>
                <div style={{ marginRight: '80px', marginBottom: '16px' }}>
                    <h1 className='raider-font'>Dive Into Portal Mania and Get to the Treasure First!</h1>
                    <p className="text">Play with your friends, or compete for prizes and jackpots in public championships!</p>

                    <div className="block-buttons" style={props.isMobile ? { width: '100%' } : {}}>
                        <Button type="default" stretched onClick={() => history('/boards')}>Win now!</Button>
                        <Button type="secondory" stretched>How to play</Button>
                    </div>
                </div>

                {props.isDesktop ? <img src={imgBoard} /> : null }

            </Div>
        </Panel>
    )
}
