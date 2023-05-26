import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Address } from 'everscale-inpage-provider'
import './style.css'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr } from '../../logic/utils'
import { Game, InfoGames, ObjPixel, Player, Portal } from '../../logic/game'
import { EverWallet } from '../../logic/wallet/hook'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    everWallet: EverWallet,
    game: Game | undefined,
    infoGame: InfoGames | undefined,
    playersRound?: Player[] | undefined,
    openModal: Function,
}

export const BoardBlock: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ board, setBoard ] = React.useState<ObjPixel[][] | undefined>(undefined)

    const [ portals, setPortals ] = React.useState<Portal[] | undefined>(undefined)

    const { address } = useParams()
    const history = useNavigate()

    function move (num: number, t: boolean = true) {
        const indEl = document.querySelector('.pixel.numb-' + num + ' .line-2') ?? document.querySelector('.pixel.numb-' + num + ' .line-3')

        // remove all active
        const all2 = document.querySelectorAll('.board .active')
        for (let i = 0; i < all2.length; i++) {
            all2[i].classList.remove('active')
        }

        if (!indEl || t === false) {
            return undefined
        }
        const ind = indEl.className.replace('line-2 id-', '').replace('line-3 id-', '')

        const all = document.querySelectorAll('.line-2.id-' + ind)
        const all3 = document.querySelectorAll('.line-3.id-' + ind)

        for (let i = 0; i < all.length; i++) {
            const ell = all[i].parentElement
            if (!ell) return undefined
            ell.classList.add('active')
        }
        for (let i = 0; i < all3.length; i++) {
            const ell = all3[i].parentElement
            if (!ell) return undefined
            ell.classList.add('active')
        }

        return true
    }

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
                                'pixel ' + y.type + ' numb-' + y.number
                            } onMouseOver={() => move(y.number)} onMouseOut={() => move(y.number, false)}>
                                {y.type === 'win' ? null : y.number}
                                <div className="players">
                                    {props.playersRound ? props.playersRound.filter(
                                        p => (p.number + 1) === y.number
                                    ).map((p, key5) => (
                                        <div key={key5} className={'player in-' + key5 }></div>
                                    )) : null}
                                </div>
                                {
                                    portals.filter(p => p.portals[1].number === y.number).length > 0
                                        ? portals.filter(p => p.portals[1].number === y.number).map((portal, key3) => (
                                            <div
                                                key={key3}
                                                // onMouseOver={() => move(portal.id)}
                                                className={ 'line-2 id-' + portal.id}
                                                style={{
                                                    width: ((portal.distance ?? 0) * 1) + 'px',
                                                    transform: 'rotate(' + portal.rotate + 'deg)'
                                                }}
                                            ></div>
                                        ))

                                        : portals.filter(p => p.portals[0].number === y.number).map((portal, key3) => (
                                            <div
                                                key={key3}
                                                className={ 'line-3 id-' + portal.id}
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
