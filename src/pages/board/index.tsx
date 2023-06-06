import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Address } from 'everscale-inpage-provider'
import moment from 'moment'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import { addStr, toH, weiToEth } from '../../logic/utils'
import { ContractEvents, ContractType, Game, InfoGames, ObjPixel, VenomWallet } from '../../logic/game'

import { BoardBlock } from './board'
import { Wallet } from '../../logic/wallet'
import { EverWallet } from '../../logic/wallet/hook'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    everWallet: EverWallet,
    openModal: Function,
    venomWallet: VenomWallet | undefined,
    typeNetwork: 'venom' | 'ever',
    load1: boolean
}

export const Board: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)
    const [ firstRender2, setFirstRender2 ] = React.useState<boolean>(false)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ infoGame, setInfoGame ] = React.useState<InfoGames | undefined>(undefined)

    const  [ playersRound, setPlayersRound ] = React.useState<(readonly [string, Address[]])[] | undefined>(undefined)

    const { address } = useParams()
    const history = useNavigate()

    async function getRounds (address1: Address) {
        if (!game) return undefined
        const players = await game.getRoundsPlayers(address1)

        setPlayersRound(players)

        return true
    }

    async function getInfo (list: Address[]) {
        if (!game) return undefined
        const info = await game.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGame(info[0])

        getRounds(list[0])

        return true
    }

    async function newRound () {
        if (!game || !address) return undefined
        props.openModal('load')
        const data = await game.createRound(new Address(address))

        props.openModal('close')
        return true
    }

    useEffect(() => {
        if (!firstRender
            && (props.typeNetwork === 'venom' ? props.venomWallet?.provider && props.venomWallet?.account : props.everWallet)) {
            setFirstRender(true)
            setGame(new Game({
                address: '',
                addressUser: '',
                wallet: props.typeNetwork === 'venom' ? props.venomWallet : props.everWallet
            }))
        }
    }, [ props.everWallet, props.venomWallet ])

    useEffect(() => {
        if (!firstRender2 && address && game) {
            setFirstRender2(true)

            const int = setInterval(() => {
                console.log('update')
                if (address) getInfo([ new Address(address) ])
            }, 2000)

            return () => clearInterval(int)
        }
    }, [ address, game ])

    useEffect(() => {
        if (game && props.typeNetwork === 'ever') game.sunc(props.everWallet)
        if (game && props.typeNetwork === 'venom') game.sunc(props.venomWallet)
    }, [ props.everWallet, props.venomWallet ])

    useEffect(() => {
        if (address && game) {
            const addr = new Address(address)
            getInfo([ addr ])

            game.onEvents(addr, (ev: ContractEvents) => {
                if (ev === 'RoundCreated' || ev === 'RoundFinished' || ev === 'RoundJoined') {
                    setTimeout(() => {
                        getInfo([ addr ])
                    }, 500)

                    // setTimeout(() => { // TODO
                    //     getRounds(addr)
                    // }, 1500)
                }
            })
        }
    }, [ address, game ])

    useEffect(() => {
        if (address) {
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
                    <div>{addStr(address)}</div>
                </div>

                {game && address && infoGame && playersRound
                    ? <div className="page-block">
                        <div className="left-block">
                            <div className="title-bar">
                                <h3 className='raider-font'>Rounds</h3>

                            </div>

                            <div className="group-block">
                                <table className="table-block">
                                    <thead>
                                        <tr>
                                            <th>Round</th>
                                            <th>Status</th>
                                            <th>Players</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infoGame.rounds && [ ...infoGame.rounds._rounds ].reverse().map((r, key) => (
                                            <tr
                                                key={key}
                                                onClick={() => history('/boards/' + address + '/' + r.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{r.id}</td>
                                                {/* NotStarted, Ready, Active, Finished, Expired */}
                                                <td>
                                                    {r.status === '0' ? 'Created' : null}
                                                    {r.status === '1' ? 'Ready' : null}
                                                    {r.status === '2' ? 'Active' : null}
                                                    {r.status === '3' ? 'Finished' : null}
                                                    {r.status === '4' ? 'Expired' : null}
                                                </td>
                                                <td>{
                                                    playersRound.filter(r1 => r1[0] === r.id).map(r2 => (
                                                        <span>{r2[1].length}</span>))
                                                }</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '16px'
                                }}>
                                    <Button onClick={() => newRound()} load={props.load1}>New round</Button>
                                </div>

                            </div>

                        </div>

                        {infoGame && infoGame.rounds
                            ? <div className="center-block">
                                <div className="title-bar">
                                    <h3 className='raider-font'>
                                        Prize: {weiToEth(infoGame.rounds._rounds[0]?.prizeFund, 9)} {props.typeNetwork.toUpperCase()}</h3>
                                    <h3 className='raider-font'>
                                        Jackpot: {weiToEth(infoGame.jackpot, 9)} {props.typeNetwork.toUpperCase()}
                                    </h3>

                                </div>

                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
                                    <BoardBlock {...props} infoGame={infoGame} game={game} />
                                </div>

                            </div> : null }

                        <div className="right-block">
                            <div className="title-bar">
                                <h3 className='raider-font'>Settings</h3>

                            </div>

                            {infoGame && infoGame.info && infoGame.rounds
                                ? <div className="group-block">
                                    <div className="block-simple">
                                        <h5>Round configuration</h5>
                                        <div className="hr" />
                                        <div className="cell">
                                            <span>Players per round</span>
                                            <span>6</span>
                                        </div>
                                        <div className="cell">
                                            <span>Round time</span>
                                            <span>{toH(Number(infoGame.rounds._rounds[0]?.roundDuration ?? 0))}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Move time</span>
                                            <span>{toH(Number(infoGame.rounds._rounds[0]?.moveDuration ?? 0))}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Rake rate, {props.typeNetwork.toUpperCase()}</span>
                                            <span>{weiToEth(infoGame.rounds._rounds[0]?.rake, 9)}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Bet rate, {props.typeNetwork.toUpperCase()}</span>
                                            <span>{weiToEth(infoGame.rounds._rounds[0]?.entryStake, 9)}</span>
                                        </div>

                                    </div>

                                    <div className="block-simple">
                                        <h5>Prize fund</h5>
                                        <div className="hr" />
                                        <div className="cell">
                                            <span>Prize per round, {props.typeNetwork.toUpperCase()}</span>
                                            <span>{weiToEth(infoGame.rounds._rounds[0]?.prizeFund, 9)}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Remaining balance, {props.typeNetwork.toUpperCase()}</span>
                                            <span>{weiToEth(infoGame.balance, 9)}</span>
                                        </div>
                                        {/* <div className="cell">
                                            <span>Paid out, {props.typeNetwork.toUpperCase()}</span>
                                            <span>3 456</span>
                                        </div> */}
                                        <div className="cell">
                                            <span>Rake to jackpot</span>
                                            <span>{infoGame.rounds._rounds[0]?.rakeToJackpotRate}%</span>
                                        </div>
                                        <div className="cell">
                                            <span>Jackpot balance, {props.typeNetwork.toUpperCase()}</span>
                                            <span>{weiToEth(infoGame.jackpot, 9)}</span>
                                        </div>

                                    </div>

                                    <div className="block-simple">
                                        <h5>Board data</h5>
                                        <div className="hr" />
                                        <div className="cell">
                                            <span>Address</span>
                                            <span>{addStr(address)}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Owner</span>
                                            <span>{addStr(infoGame.owner)}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Size</span>
                                            <span>{infoGame.info._board.rows + 'x' + infoGame.info._board.columns}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Read beams</span>
                                            <span>{infoGame?.info?._redBeams.length}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Blue beams</span>
                                            <span>{infoGame.info._blueBeams.length}</span>
                                        </div>
                                        <div className="cell">
                                            <span>Seed</span>
                                            <span>{infoGame.seed}</span>
                                        </div>

                                    </div>
                                </div> : null }

                        </div>

                    </div> : null }

            </Div>
        </Panel>
    )
}
