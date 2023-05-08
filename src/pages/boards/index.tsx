import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import './style.css'
import { Panel, Div, Button } from '../../components'

import imgBoard from '../../img/Playable.svg'

interface MainProps {
    id: string
}

export const Boards: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <Panel id={props.id}>
            <Div className="panel-boards">
                <div className="nav-bar">

                </div>

                <div className="page-block">

                </div>

            </Div>
        </Panel>
    )
}
