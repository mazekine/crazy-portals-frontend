import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr } from '../../logic/utils'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean
}

export const Board: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const { address } = useParams()
    const history = useNavigate()

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    useEffect(() => {
        if (address) {

        } else {
            history('/boards')
        }
    }, [ address ])

    return (
        <Panel id={props.id}>
            <Div className="panel-board" style={props.isDesktop ? {} : { flexDirection: 'column' }}>

                <div className="nav-bar">
                    <Link onClick={() => history('/')}>Home</Link>
                    <img src={chery} />
                    <Link onClick={() => history('/boards')}>Boards</Link>
                    <img src={chery} />
                    <div>{addStr(address)}</div>
                </div>

            </Div>
        </Panel>
    )
}
