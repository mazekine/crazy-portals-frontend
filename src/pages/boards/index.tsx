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
    typeNetwork: 'venom' | 'ever'
}

export const Boards: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ listGames, setListGames ] = React.useState<Address[] | undefined>(undefined)

    const  [ game, setGame ] = React.useState<Game | undefined>(undefined)

    const  [ infoGames, setInfoGames ] = React.useState<InfoGames[] | undefined>(undefined)

    const history = useNavigate()

    async function getInfo (list: Address[] | undefined = listGames) {
        if (!game || !list) return undefined
        const info = await game.getAllInfoGames(list)

        if (!info) return undefined
        setInfoGames(info)

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
        if (game) {
            game.getAllGames().then((games) => {
                if (games) setListGames(games)
            })
        }
    }, [ game, props.venomWallet, props.everWallet ])

    useEffect(() => {
        if (listGames && game) {
            getInfo()
        }
    }, [ listGames ])

    return (
        <Panel id={props.id}>
            <Div className="panel-boards">
                <div className="nav-bar">
                    <Link onClick={() => history('/')}>Home</Link>
                    <img src={chery} />
                    <div>Boards</div>
                </div>

                <div className="page-block" style={props.isMobile ? { flexDirection: 'column' } : {}}>
                    {props.isMobile || true ? null : <div className="left-menu">
                        <div className="title-bar">
                            <h3 className='raider-font'>Board of the Day</h3>
                            <div className="right-bar">

                            </div>

                        </div>

                        <div className="group-block" style={{padding: 0}}>
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
                                            <span>16 x 16 cells</span>
                                            <div className="map-block-cell-right">
                                                <Icon src={portal} size={24} />
                                                <span>14</span>
                                            </div>
                                        </div>

                                        <div className="map-block-cell">
                                            <Icon src={sqad2} size={16} />
                                            <span>100 players</span>
                                            <div className="map-block-cell-right color-blue">
                                                <Icon src={portal2} size={24} />
                                                <span>2</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-block">
                                    <div>
                                        <h3>5 000<span>{props.typeNetwork.toUpperCase()}</span></h3>
                                        <div className="blue-text">remaining prize fund</div>
                                    </div>

                                    <div>
                                        <h4>10<span>{props.typeNetwork.toUpperCase()}</span></h4>
                                        <div className="blue-text">prize per round</div>
                                    </div>

                                    <Button>Play now!</Button>

                                </div>

                            </div>

                            <div className="info-of-game"  style={{padding: '20px'}}>
                                <div className="in-block">

                                </div>

                            </div>

                        </div>

                    </div>}
                    <div className="content-block" style={props.isMobile ? { width: '99%' } : { width: '100%' }}>

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
                                            <th>Prize per<br /> round, {props.typeNetwork.toUpperCase()}</th>
                                            {/* <th>Winnings,<br /> {props.typeNetwork.toUpperCase()}</th> */}
                                            <th>Balance left,<br /> {props.typeNetwork.toUpperCase()}</th>
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
