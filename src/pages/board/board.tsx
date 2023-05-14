import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr } from '../../logic/utils'
import { Game, InfoGames, ObjPixel, Portal } from '../../logic/game'
import { EverWallet } from '../../logic/wallet/hook'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    everWallet: EverWallet,
    game: Game | undefined,
    infoGame: InfoGames | undefined
}

export const BoardBlock: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ board, setBoard ] = React.useState<ObjPixel[][] | undefined>(undefined)

    const [ portals, setPortals ] = React.useState<Portal[] | undefined>(undefined)

    const { address } = useParams()
    const history = useNavigate()

    useEffect(() => {
        if (!firstRender && props.infoGame && props.infoGame.info && address) {
            setFirstRender(true)

            const localBoard = Game.genArrBoard(
                Number(props.infoGame.info._board.columns),
                props.infoGame.info._blueBeams.concat(props.infoGame.info._redBeams)
            )

            setBoard(localBoard[0])

            setPortals(localBoard[1])
        }
        console.log(props.infoGame, props.infoGame?.info, address)
    }, [ props.infoGame, address ])

    useEffect(() => {
        if (address) {
        } else {
            history('/boards')
        }
    }, [ address ])

    return (
        <div className="board">
            {board && portals
                ? board.map((x, key) => (
                    <div key={key} className="line">
                        {x.map((y, key2) => (
                            <div key={key2} className={
                                'pixel ' + y.type
                            }>
                                {y.type === 'win' ? null : y.number}
                                {
                                    portals.filter(p => p.portals[1].number === y.number).length > 0
                                        ? portals.filter(p => p.portals[1].number === y.number).map((portal, key3) => (
                                            <div
                                                key={key3}
                                                className="line-2"
                                                style={{
                                                    width: ((portal.distance ?? 0) * 1) + 'px',
                                                    transform: 'rotate(' + portal.rotate + 'deg)'
                                                }}
                                            ></div>
                                        ))

                                        : portals.filter(p => p.portals[0].number === y.number).map((portal, key3) => (
                                            <div
                                                key={key3}
                                                className="line-3"
                                                style={{
                                                    width: ((portal.distance ?? 0) * 1) + 'px',
                                                    transform: 'rotate(' + ((portal.rotate ?? 0) + 180) + 'deg)'
                                                }}
                                            ></div>
                                        ))

                                }
                            </div>
                        ))}
                    </div>
                ))

                : null}

        </div>
    )
}
