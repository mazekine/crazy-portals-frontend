import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Address } from 'everscale-inpage-provider'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr } from '../../logic/utils'
import { Game, InfoGames, ObjPixel } from '../../logic/game'

import { BoardBlock } from './board'
import { Wallet } from '../../logic/wallet'
import { EverWallet } from '../../logic/wallet/hook'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    everWallet: EverWallet
}

export const Round: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ playersNumber, setPlayersNumber ] = React.useState<(readonly [Address, string])[] | undefined>(undefined)

    const  [ infoGame, setInfoGame ] = React.useState<InfoGames | undefined>(undefined)

    const { address, round } = useParams()
    const history = useNavigate()

    async function getInfo (list: Address[]) {
        if (!game) return undefined
        const info = await game.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGame(info[0])

        const players = await game.getPlayerCell(list[0])
        setPlayersNumber(players)
        game.getPlayerRound(list[0])

        return true
    }

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)

            setGame(new Game({ address: '', addressUser: '', wallet: props.everWallet }))
        }
    }, [])

    useEffect(() => {
        if (game) game.sunc(props.everWallet)
    }, [ props.everWallet ])

    useEffect(() => {
        if (address && game) {
            getInfo([ new Address(address) ])
        }
    }, [ address, game ])

    useEffect(() => {
        if (address && round) {
            getInfo([ new Address(address) ])
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
                    <Link onClick={() => history('/boards/' + address)}>{addStr(address)}</Link>
                    <img src={chery} />
                    <div>{round}</div>
                </div>

                {game && address && infoGame && round && playersNumber
                    ? <div className="page-block">
                        <div className="left-block">
                            <div className="title-bar">
                                <h3 className='raider-font'>Actions</h3>

                            </div>

                            <div className="group-block">
                                <div className="cell">Anonymous capybara rolled moves 3 steps</div>

                            </div>

                        </div>

                        <div className="center-block">
                            <div className="title-bar">
                                <h3 className='raider-font'>Prize: 10</h3>
                                <h3 className='raider-font'>Jackpot: 100.17</h3>

                            </div>

                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
                                <BoardBlock {...props} infoGame={infoGame} game={game} playersNumber={playersNumber} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', marginTop: '40px' }}>
                                {playersNumber.map((p, key) => (
                                    <div className="player-block" key={key}>
                                        <div className={'player in-' + key}></div>
                                        <div>{addStr(p[0].toString())}</div>
                                    </div>
                                ))}

                            </div>

                        </div>

                        <div className="right-block">
                            <div className="title-bar">
                                <h3 className='raider-font'></h3>

                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                <Button onClick={() => game.joinRound(new Address(address), round)}>Join</Button>
                                <Button onClick={() => game.startRoll(new Address(address))}>Roll</Button>
                            </div>

                        </div>

                    </div> : null }

            </Div>
        </Panel>
    )
}
