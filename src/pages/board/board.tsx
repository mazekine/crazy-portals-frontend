import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr } from '../../logic/utils'
import { Game, ObjPixel } from '../../logic/game'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean
}

export const BoardBlock: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ board, setBoard ] = React.useState<ObjPixel[][] | undefined>(undefined)

    const { address } = useParams()
    const history = useNavigate()

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    useEffect(() => {
        if (address) {
            const board1 = new Game({ address: '', addressUser: '' })

            setBoard(board1.genArrBoard(10))
        } else {
            history('/boards')
        }
    }, [ address ])

    return (
        <div className="board">
            {board
                ? board.map((x, key) => (
                    <div key={key} className="line">
                        {x.map((y, key2) => (
                            <div key={key2} className="pixel">
                                {y.number}
                            </div>
                        ))}
                    </div>
                ))

                : null}

        </div>
    )
}
