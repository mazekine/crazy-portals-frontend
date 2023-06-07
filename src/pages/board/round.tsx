import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './style.css'
import { Address } from 'everscale-inpage-provider'
import moment from 'moment'
import { Panel, Div, Button, Link } from '../../components'

import chery from '../../img/chery.svg'
import win1 from '../../img/win.svg'
import win2 from '../../img/win2.svg'
import { addStr, delay, weiToEth } from '../../logic/utils'
import { ContractEvents, Game, InfoGames, ObjPixel, Player, PlayerMoved, VenomWallet, Round as Round2 } from '../../logic/game'

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

interface AnimationWait {
    address: string,
    from: number,
    to: number,
    fromO: { x: string, y: string },
    toO: { x: string, y: string }
}

export const Round: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)
    const [ firstRender2, setFirstRender2 ] = React.useState<boolean>(false)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ win, setWin ] = React.useState<number>(0) // 0 - no 1 - win 2 - jecpot

    const  [ timer, setTimer ] = React.useState<string>('00:00')

    const  [ infoGame, setInfoGame ] = React.useState<InfoGames | undefined>(undefined)

    const  [ thisRound, setThisRound ] = React.useState<Round2 | undefined>(undefined)

    const  [ playersRound2, setPlayersRound2 ] = React.useState<Player[] | undefined>(undefined)

    const  [ animation, setAnimation ] = React.useState<boolean>(false)

    const  [ interval2, setInterval2 ] = React.useState<NodeJS.Timer | undefined>(undefined)

    const  [ animationWait, setAnimationWait ] = React.useState<AnimationWait[]>([])
    const  [ waitCount, setWaitCount ] = React.useState<number>(0)

    const  [ waitFirst, setWaitFirst ] = React.useState<boolean>(false)

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

    function playerGo (
        fromN: number,
        toN: number,
        address2: string,
        playersRound3: Player[],
        fromO: { x: number, y: number },
        toO: { x: number, y: number }
    ) {
        if (!playersRound3) {
            console.log('playerGo not start')
            return undefined
        }

        // const cells = Game.generatedCells(Number(infoGame.info._board.columns))
        // const fromN = cells[Number(from.y) - 1][Number(from.x) - 1]
        // const toN = cells[Number(to.y) - 1][Number(to.x) - 1]
        console.log('playerGo start')
        setAnimation(true)

        let moveToUp = true
        const distance = Math.abs(toN - fromN)
        if (fromN > toN) { // move to lose
            moveToUp = false
        }
        const playerIndex = playersRound3.findIndex(p => p.address.toString() === address2)

        console.log('playerIndex', playerIndex)
        if (playerIndex === -1) {
            setAnimation(false)
            return undefined
        }

        const i = 0
        const updatePlayer = playersRound3[playerIndex]
        // const intr = setInterval(() => {
        //     if (i === distance) {
        //         clearInterval(intr)
        //         setAnimation(false)
        //         // setWaitCount(waitCount - 1)
        //         return
        //     }

        //     updatePlayer.number = moveToUp ? Number(fromN) + 1 + i : Number(fromN) - 1 + i
        //     const listPlayers = playersRound3
        //     listPlayers[playerIndex] = updatePlayer

        //     setPlayersRound2(listPlayers)

        //     console.log('playerIndex i', i, updatePlayer.number)

        //     setWaitCount(waitCount - 1 < 0 ? 0 : waitCount - 1)

        //     i++
        // }, 1000 / distance)

        document.querySelector('.a-' + address2.replace(':', ''))?.setAttribute('style', 'opacity: 0')
        setTimeout(() => {
            updatePlayer.number = toN
            const listPlayers = playersRound3
            listPlayers[playerIndex] = updatePlayer

            setPlayersRound2(listPlayers)
            setWaitCount(waitCount - 1 < 0 ? 0 : waitCount - 1)
            document.querySelector('.a-' + address2.replace(':', ''))?.setAttribute('style', 'opacity: 1')

            setAnimation(false)
        }, 550)
        const positionX = toO.x - fromO.x
        const positionY = fromO.y - toO.y // fix transform
        const styleText = `transform: translateY(${positionY * 44}px) translateX(${positionX * 44}px);opacity: 1`
        document.getElementById(address2)?.setAttribute('style', styleText)
        console.log('styleText', styleText)
        console.log('address2', document.getElementById(address2))
        return true
    }

    async function delayCb (de: number, cb: Function) {
        await delay(de)
        cb()
    }

    async function getPlayers (address1: Address, update: boolean = false) {
        if (!game) {
            console.log('error getPlayers')
            return undefined
        }
        const players3 = await game.getPlayersForRound(address1, round ?? '')

        if (update && playersRound2) {
            for (let i = 0; i < playersRound2.length; i++) {
                const ind = playersRound2?.findIndex(p => p.address.toString() === playersRound2[i].address.toString())
                if (ind === -1) {
                    setPlayersRound2(players3)
                }
            }
        }
        if (!playersRound2 || !update) {
            setPlayersRound2(players3)
        }
        return true
    }

    async function getInfo (list: Address[]) {
        if (!game) return undefined
        const info = await game.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGame(info[0])

        if (!round) return undefined

        // const players = await game.getPlayerCell(list[0])
        // setPlayersNumber(players)
        // game.getPlayerRound(list[0])

        // const players2 = await game.getRoundsPlayers(list[0])

        // setPlayersRound(players2)

        if (!info[0].rounds) return undefined
        const roundInfo = info[0].rounds._rounds.filter(r => r.id === round)
        setThisRound(roundInfo[0])

        getPlayers(list[0])

        if (info[0] && info[0].rounds) {
            startTimer(Number(info[0].rounds._rounds.filter(r => r.id === round)[0].validUntil))
        }

        return true
    }

    async function claim () {
        if (!game || !address || !round) {
            console.error('claim null')
            return undefined
        }
        props.openModal('load')
        const data = await game.claim(new Address(address), round)

        props.openModal('close')
        return true
    }

    async function giveUp () {
        if (!game || !address || !round) {
            console.error('giveUp null')
            return undefined
        }
        // props.openModal('load')
        const data = await game.giveUp(new Address(address))

        // props.openModal('close')
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
        console.log('animationWait length', animationWait)
        if (animationWait.length > 0 && playersRound2 && !animation) {
            console.log('waitCount', waitCount)
            // let waitCountLocal = 0
            if (waitFirst) {
                for (let i = waitCount; i < animationWait.length; i++) {
                    console.log('animationWait', animationWait)
                    delayCb(i * 1000, () => playerGo(
                        animationWait[i].from,
                        animationWait[i].to,
                        animationWait[i].address,
                        playersRound2,
                        { x: Number(animationWait[i].fromO.x), y: Number(animationWait[i].fromO.y) },
                        { x: Number(animationWait[i].toO.x), y: Number(animationWait[i].toO.y) }
                    ))
                // waitCountLocal += Math.abs(animationWait[i].from - animationWait[i].to)
                }
                setWaitCount(waitCount + animationWait.length)
                setAnimationWait([])

                setWaitFirst(false)
            } else {
                setTimeout(() => {
                    setWaitFirst(true)
                }, 1000)
            }
        }
    }, [ animationWait, animation, waitFirst ])

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
        if (address && game && round && playersRound2 && !firstRender2) {
            setFirstRender2(true)
            const addr = new Address(address)

            game.onEvents(addr, (ev: ContractEvents, data: any, animationWait2 = animationWait) => {
                if (ev === 'PlayerMoved' || ev === 'PlayerRemovedFromRound' || ev === 'RoundFinished' || ev === 'RoundJoined') {
                    if (data.round === round) {
                        if (ev === 'PlayerMoved') {
                            const typedData = data as PlayerMoved

                            if (Number(typedData.from.cell) === 0) {
                                setTimeout(() => {
                                    getPlayers(addr, false)
                                }, 500)
                            } else {
                                console.log('setAnimationWait', animationWait2)
                                setAnimationWait(a => [ ...a, {
                                    address: typedData.player.toString(),
                                    from: Number(typedData.from.cell),
                                    to: Number(typedData.to.cell),
                                    fromO: typedData.from.coordinate,
                                    toO: typedData.to.coordinate
                                } ])
                            }
                        }

                        if (ev === 'RoundJoined') {
                            setTimeout(() => {
                                getPlayers(addr, true)
                            }, 500)
                        }
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

            // const int = setInterval(() => {
            //     console.log('update')
            //     if (address && !animation) getPlayers(new Address(address))
            //     else console.log('error address')
            // }, 2000)

            // return () => clearInterval(int)
        }
    }, [ address, game, playersRound2, round ])

    useEffect(() => {
        if (props.venomWallet?.address === undefined) {
            setFirstRender2(false)
        }
    }, [ props.venomWallet ])

    useEffect(() => {
        if (address && round && game && !animation && !interval2) {
            console.log('===start update')
            const int = setInterval(() => {
                console.log('update', !animation)
                // getPlayers(new Address(address), true)
            }, 2000)

            setInterval2(int)

            // return () => clearInterval(int)
        } if (interval2 && animation) {
            console.log('===stop update')
            clearInterval(interval2)
            setInterval2(undefined)
        }
    }, [ animation, address, game, round, interval2 ])

    useEffect(() => {
        if (game && props.typeNetwork === 'ever') game.sunc(props.everWallet)
        if (game && props.typeNetwork === 'venom') game.sunc(props.venomWallet)
    }, [ props.everWallet, props.venomWallet ])

    useEffect(() => {
        if (address && game && round) {
            // setFirstRender2(true)
            const addr = new Address(address)

            getInfo([ addr ])
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

                {game && address && infoGame && round && playersRound2 && win === 0 && infoGame.rounds && thisRound
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
                                <h3 className='raider-font'>Prize: {weiToEth(thisRound.prizeFund, 9)}</h3>
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
                                    ? <div style={{ width: '100%' }}>
                                        <Button onClick={() => startRoll()} stretched load={props.load1}>Roll</Button>
                                        {thisRound.giveUpAllowed
                                            ? <Button
                                                onClick={() => giveUp()}
                                                stretched
                                                type="outline"
                                                size="m"
                                                style={{ marginTop: '30px' }}
                                            >Give Up</Button> : null }
                                    </div>
                                    : <Button onClick={() => joinRound()} stretched load={props.load1}>Join</Button> }
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
