import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './style.css'
import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { Panel, Div, Button, Link, Icon } from '../../components'

import chery from '../../img/chery.svg'

import sqad from '../../img/sqad.svg'
import sqad2 from '../../img/sqad.svg'
import portal from '../../img/portal.svg'
import portal2 from '../../img/portal2.svg'
import { Game, InfoGame, InfoGames, VenomWallet } from '../../logic/game'
import { EverWallet } from '../../logic/wallet/hook'
import { addStr, weiToEth } from '../../logic/utils'

interface MainProps {
    id: string,
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    everWallet: EverWallet,
    openModal: Function,
    venomWallet: VenomWallet | undefined,
    typeNetwork: 'venom' | 'ever',
    nameNetwork: 'venom' | 'ever'
}

export const Boards: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)
    const [ firstRender2, setFirstRender2 ] = React.useState<boolean>(false)
    const [ firstRender3, setFirstRender3 ] = React.useState<boolean>(false)

    const [ listGames, setListGames ] = React.useState<Address[] | undefined>(undefined)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ infoGames, setInfoGames ] = React.useState<InfoGames[] | undefined>(undefined)

    const  [ infoGamesDay, setInfoGamesDay ] = React.useState<InfoGames | undefined>(undefined)

    const history = useNavigate()

    async function getInfo (list: Address[] | undefined = listGames, gameLocal: Game | undefined = game) {
        if (!gameLocal || !list) {
            console.error('getInfo game list')
            return undefined
        }
        const info = await gameLocal.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGames(info)

        return true
    }

    async function getBoardDay (gameLocal: Game | undefined = game) {
        if (!gameLocal) {
            console.error('getBoardDay game')
            return undefined
        }

        const address = await gameLocal.getGameDay()

        if (!address) {
            console.error('getBoardDay address')
            return undefined
        }

        const info = await gameLocal.getAllInfoGames([ address ])

        if (!info) {
            console.error('getBoardDay info')
            return undefined
        }

        setInfoGamesDay(info[0])

        return true
    }

    async function loadDataPage (accaount: boolean, wallet: VenomWallet | undefined) {
        console.log('getData', accaount)
        if (accaount) {
            const gameLocal = new Game({
                address: '',
                addressUser: '',
                wallet,
                network: props.typeNetwork
            })
            setGame(gameLocal)
            gameLocal.getAllGames().then((games) => {
                if (games) {
                    getInfo(games, gameLocal)
                    setListGames(games)
                }
            })

            getBoardDay(gameLocal)
            // console.log('compl', gameLocal)
        } else {
            setListGames(undefined)
            setInfoGamesDay(undefined)
            setInfoGames(undefined)
            setGame(undefined)
            setGame(undefined)
        }
    }

    useEffect(() => {
        // if (!firstRender &&
        //      props.venomWallet?.provider && props.venomWallet?.account) {
        //     setFirstRender(true)
        //     setGame(new Game({
        //         address: '',
        //         addressUser: '',
        //         wallet: props.venomWallet,
        //         network: props.typeNetwork
        //     }))
        // }
        // if (firstRender && !props.venomWallet?.account) {
        //     setFirstRender3(false)
        // }
    }, [ props.venomWallet?.account ])

    useEffect(() => {
        // if (game && !firstRender2  && props.venomWallet?.account) {
        //     setFirstRender2(true)

        //     // console.log('=======')
        //     game.getAllGames().then((games) => {
        //         if (games) setListGames(games)
        //     })
        // }
        // if (firstRender2 && !props.venomWallet?.account) {
        //     setFirstRender3(false)

        //     setListGames([])
        // }
    }, [ game, props.venomWallet?.account ])

    useEffect(() => {
        // if (props.venomWallet) loadDataPage(!!props.venomWallet?.account, props.venomWallet)
        // if (listGames && game && !firstRender3 && props.venomWallet?.account) {
        //     setFirstRender3(true)
        //     // console.log('=======')
        //     getInfo()

        //     getBoardDay()
        // }
        // if (firstRender3 && !props.venomWallet?.account) {
        //     setFirstRender3(false)

        //     setInfoGamesDay(undefined)
        // }
    }, [ listGames, props.venomWallet?.account ])

    useEffect(() => {
        if (props.venomWallet?.address) {
            console.log('Test address', props.venomWallet?.address)
            loadDataPage(true, props.venomWallet)
        } else if (!props.venomWallet?.address) {
            console.log('no address')
            loadDataPage(false, props.venomWallet)
        }
    }, [ props.venomWallet?.address && props.venomWallet?.account ])

    return (
        <Panel id={props.id}>
            <Div className="panel-boards">
                <div className="nav-bar">
                    <Link onClick={() => history('/')}>Home</Link>
                    <img src={chery} />
                    <div>Boards</div>
                </div>

                <div className="page-block" style={props.isMobile ? { flexDirection: 'column' } : {}}>
                    {!props.isMobile
                        && infoGamesDay && infoGamesDay.rounds && infoGamesDay.rounds?._rounds.length > 0 ? <div className="left-menu">
                            <div className="title-bar">
                                <h3 className='raider-font'>Board of the Day</h3>
                                <div className="right-bar">

                                </div>

                            </div>

                            <div className="group-block" style={{ padding: 0 }}>
                                <div className="header-block">
                                    <div className="map-block">
                                        <div style={{ padding: '0 0 20px 0', width: '100%' }}>
                                            <h4>Fiercy Trickster</h4>
                                            <div className="blue-text">Hard</div>
                                        </div>
                                        <div className="hr" />
                                        <div style={{  width: '100%' }}>
                                            <div className="map-block-cell">
                                                <Icon src={sqad} size={16} />
                                                <span>{infoGamesDay.info?._board.columns} x {infoGamesDay.info?._board.columns} cells</span>
                                                <div className="map-block-cell-right">
                                                    <Icon src={portal} size={24} />
                                                    <span>{infoGamesDay.info?._redBeams.length}</span>
                                                </div>
                                            </div>

                                            <div className="map-block-cell">
                                                <Icon src={sqad2} size={16} />
                                                <span>{infoGamesDay.rounds?._rounds[0].maxPlayers} players</span>
                                                <div className="map-block-cell-right color-blue">
                                                    <Icon src={portal2} size={24} />
                                                    <span>{infoGamesDay.info?._blueBeams.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-block">
                                        <div>
                                            <h3>{weiToEth(infoGamesDay.jackpot, 9)}<span>{props.nameNetwork.toUpperCase()}</span></h3>
                                            <div className="blue-text">remaining prize fund</div>
                                        </div>

                                        <div>
                                            <h4>
                                                {weiToEth(infoGamesDay.rounds?._rounds[0].prizeFund, 9)}
                                                <span>{props.nameNetwork.toUpperCase()}</span>
                                            </h4>
                                            <div className="blue-text">prize per round</div>
                                        </div>

                                        <Button onClick={() => history('/boards/' + infoGamesDay.address.toString())}>Play now!</Button>

                                    </div>

                                </div>

                                <div className="info-of-game"  style={{ padding: '20px' }}>
                                    <div className="in-block">

                                    </div>

                                </div>

                            </div>

                        </div> : null}
                    <div className="content-block" style={props.isMobile ? { width: '100%' }
                        : { width: infoGamesDay && infoGamesDay.rounds ? '60%' : '100%', marginLeft: '30px' }}>

                        <div className="title-bar">
                            <h3 className='raider-font'>All boards</h3>
                            <div className="right-bar">

                            </div>
                        </div>

                        <div className="group-block">
                            <Div>
                                <table className="table-block">
                                    <thead>
                                        <tr>
                                            <th>Address</th>
                                            <th>Size</th>
                                            <th>Portals</th>
                                            <th>Rounds</th>
                                            <th>Prize per<br /> round, {props.nameNetwork.toUpperCase()}</th>
                                            {/* <th>Winnings,<br /> {props.nameNetwork.toUpperCase()}</th> */}
                                            <th>Balance left,<br /> {props.nameNetwork.toUpperCase()}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infoGames && infoGames.map((gameL, key: number) => (
                                            gameL && gameL.info && gameL.rounds ? <tr key={key}>
                                                <td
                                                    onClick={
                                                        () => history(
                                                            '/boards/' + gameL.address.toString()
                                                        )
                                                    }
                                                >{addStr(gameL.address.toString())}</td>
                                                <td>{gameL.info._board.columns + 'x' + gameL.info._board.columns}</td>
                                                <td>🔵 {gameL.info._blueBeams.length} 🔴 {gameL.info._redBeams.length}</td>
                                                <td>{gameL.rounds._rounds.length}</td>
                                                <td>{weiToEth(gameL.rounds._rounds[0]?.prizeFund, 9)}</td>
                                                {/* <td>100.11</td> */}
                                                <td>{weiToEth(gameL.rounds._rounds[0]?.prizeFund, 9)}</td>
                                            </tr> : null
                                        ))}

                                    </tbody>
                                </table>
                            </Div>

                        </div>

                    </div>

                </div>

            </Div>
        </Panel>
    )
}
