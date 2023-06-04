import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Address } from 'everscale-inpage-provider'
import moment from 'moment'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import win1 from '../../img/win.svg'
import win2 from '../../img/win2.svg'
import { addStr, weiToEth } from '../../logic/utils'
import { ContractEvents, Game, InfoGames, ObjPixel, Player, VenomWallet } from '../../logic/game'

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
    typeNetwork: 'venom' | 'ever'
}

export const Round: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)
    const [ firstRender2, setFirstRender2 ] = React.useState<boolean>(false)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ win, setWin ] = React.useState<number>(0) // 0 - no 1 - win 2 - jecpot

    const  [ timer, setTimer ] = React.useState<string>('00:00')

    const  [ infoGame, setInfoGame ] = React.useState<InfoGames | undefined>(undefined)

    const  [ playersRound2, setPlayersRound2 ] = React.useState<Player[] | undefined>(undefined)

    const { address, round } = useParams()
    const history = useNavigate()

    function startTimer (date: number) {
        const eventTime = date // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
        const currentTime = Date.now() / 1000 // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
        const diffTime = eventTime - currentTime
        let duration = moment.duration(diffTime * 1000, 'milliseconds')
        const interval = 1000

        if (diffTime < 0) return

        const interv = setInterval(() => {
            duration = moment.duration(Number(duration) - interval, 'milliseconds')
            if (duration.seconds() === 0 && duration.minutes() === 0) {
                setTimer('00:00')
                clearInterval(interv)
            }
            setTimer(`${duration.minutes()}:${duration.seconds()}`)
        }, interval)
    }

    async function getPlayers (address1: Address) {
        if (!game) return undefined
        const players3 = await game.getPlayersForRound(address1, round ?? '')
        setPlayersRound2(players3)
        return true
    }

    async function getInfo (list: Address[]) {
        if (!game) return undefined
        const info = await game.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGame(info[0])

        // const players = await game.getPlayerCell(list[0])
        // setPlayersNumber(players)
        // game.getPlayerRound(list[0])

        // const players2 = await game.getRoundsPlayers(list[0])

        // setPlayersRound(players2)

        getPlayers(list[0])

        if (info[0] && info[0].rounds) {
            startTimer(Number(info[0].rounds._rounds.filter(r => r.id === round)[0].validUntil))
        }

        return true
    }

    async function claim () {
        if (!game || !address || !round) {
            console.error('joinRound null')
            return undefined
        }
        props.openModal('load')
        const data = await game.claim(new Address(address), round)

        props.openModal('close')
        return true
    }

    async function joinRound () {
        if (!game || !address || !round) {
            console.error('joinRound null')
            return undefined
        }
        props.openModal('load')
        const data = await game.joinRound(new Address(address), round)

        props.openModal('close')
        return true
    }

    async function startRoll () {
        if (!game || !address) {
            console.error('startRoll null')
            return undefined
        }
        props.openModal('load')
        const data = await game.startRoll(new Address(address))

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
                if (address) getPlayers(new Address(address))
                else console.log('error address')
            }, 2000)

            return () => clearInterval(int)
        }
    }, [ address, game ])

    useEffect(() => {
        if (game && props.typeNetwork === 'ever') game.sunc(props.everWallet)
        if (game && props.typeNetwork === 'venom') game.sunc(props.venomWallet)
    }, [ props.everWallet, props.venomWallet ])

    useEffect(() => {
        if (address && game && round) {
            const addr = new Address(address)

            getInfo([ addr ])

            game.onEvents(addr, (ev: ContractEvents, data: any) => {
                if (ev === 'PlayerMoved' || ev === 'PlayerRemovedFromRound' || ev === 'RoundFinished' || ev === 'RoundJoined') {
                    if (data.round === round) {
                        setTimeout(() => {
                            getPlayers(addr)
                        }, 500)
                    }
                }

                if (ev === 'RoundFinished') {
                    if (data.roundId === round) {
                        console.log('Finish!!!')
                        if (data.winner.toString() === props.venomWallet?.address) {
                            setWin(3)
                        } else {
                            setWin(1)
                        }
                    }
                }
            })
        }
    }, [ address, game, round ])

    useEffect(() => {
        console.log('update playersRound2', playersRound2)
    }, [ playersRound2 ])

    useEffect(() => {
        if (address && round) {
            getInfo([ new Address(address) ])

            // setWin(1)
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
                    <div>Round #{round}</div>
                </div>

                {game && address && infoGame && round && playersRound2 && win === 0 && infoGame.rounds
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
                                <h3 className='raider-font'>Prize: {weiToEth(infoGame.rounds._rounds[0]?.prizeFund, 9)}</h3>
                                <h3 className='raider-font'>{timer}</h3>
                                <h3 className='raider-font'>Jackpot: {weiToEth(infoGame.jackpot, 9)}</h3>

                            </div>

                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
                                <BoardBlock
                                    {...props}
                                    infoGame={infoGame}
                                    game={game}
                                    playersRound={playersRound2}
                                />
                            </div>

                            <div className="start_line">
                                <span style={{ fontSize: '10px' }}>Start line:</span>
                                {playersRound2.map((p, key5) => (
                                    p.number === 0 ? <div key={key5} className={'player in-' + key5 }></div> : null
                                ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', marginTop: '20px' }}>
                                {playersRound2.map((p, key) => (
                                    <div className={'player-block'
                                        + (p.address.toString() === props.venomWallet?.address ? ' you' : '')} key={key}>
                                        <div className={'player in-' + key}></div>
                                        <div>{addStr(p.address.toString())}</div>
                                    </div>
                                ))}

                            </div>

                        </div>

                        <div className="right-block" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            <div className="title-bar">
                                <h3 className='raider-font'></h3>

                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60%' }} >
                                {/* {props.typeNetwork === 'venom' && props.venomWallet && props.venomWallet.address ?
                                    playersRound2.findIndex(p => p.address.toString() === props.venomWallet.address) !== -1 ?
                                    <Button onClick={() => startRoll()}>Roll</Button>
                                : null} */}

                                {playersRound2.findIndex(
                                    p => p.address.toString() === (
                                        props.typeNetwork === 'venom'
                                            ? props.venomWallet?.address : props.everWallet.account?.address.toString()
                                    )
                                ) > -1
                                    ? <Button onClick={() => startRoll()} stretched>Roll</Button>
                                    : <Button onClick={() => joinRound()} stretched>Join</Button> }
                                {/* <Button onClick={() => joinRound()}>Join</Button>
                                <Button onClick={() => startRoll()}>Roll</Button> */}
                            </div>

                        </div>

                    </div> : null }

                {win === 1 ? <div className="page-block" style={{ justifyContent: 'center' }}>
                    <div className="center-block" >
                        <div className="block-img">
                            <div className="in-block-img">
                                <img src={win1} />
                                <h3 className='raider-font' style={{ textAlign: 'center' }}>You are the winner!</h3>
                                <Button onClick={() => claim()} stretched>Claim reward</Button>
                            </div>
                        </div>
                        <div className="tre-btn">
                            <Button onClick={() => history('/boards/' + address)} stretched type="secondory">Back</Button>
                            <Button onClick={() => null} stretched type="secondory">Stats</Button>
                            <Button onClick={() => history('/boards/' + address)} stretched type="secondory">Replay</Button>

                        </div>
                    </div>
                </div> : null}

                {win === 3 ? <div className="page-block" style={{ justifyContent: 'center' }}>
                    <div className="center-block">
                        <div className="block-img">
                            <div className="in-block-img">
                                <img src={win2} />
                                <h3 className='raider-font' style={{ textAlign: 'center' }}>Well played!</h3>
                                <Button onClick={() => history('/boards/' + address)} stretched>Try again</Button>
                            </div>
                        </div>
                        <div className="tre-btn">
                            <Button onClick={() => history('/boards/' + address)} stretched type="secondory">Back</Button>
                            <Button onClick={() => null} stretched type="secondory">Stats</Button>
                            <Button onClick={() => history('/boards/' + address)} stretched type="secondory">Replay</Button>

                        </div>
                    </div>
                </div> : null}

            </Div>
        </Panel>
    )
}
