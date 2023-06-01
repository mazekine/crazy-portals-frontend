import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VenomConnect from 'venom-connect'
import { Button, Header } from '../components'
import logo from '../img/logo.svg'
import user from '../img/user.svg'
import logout from '../img/logout.svg'

import './header.css'
import { Wallet } from '../logic/wallet'
import { addStr, weiToEth } from '../logic/utils'
import { EverWallet } from '../logic/wallet/hook'

interface HeaderProps {
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean,
    provider?: Wallet | undefined,
    everWallet: EverWallet,
    typeNetwork: 'venom' | 'ever',
    venomConnect: VenomConnect | undefined,
    venomProvider: any,
    address: any,
    balance: any,
    setTypeNetwork: Function
}

export const HeaderBlock: React.FC<HeaderProps> = (props: HeaderProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const history = useNavigate()

    const onConnectButtonClick = async () => {
        props.venomConnect?.connect()
    }

    const onDisconnectButtonClick = async () => {
        props.venomProvider?.disconnect()
    }

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    useEffect(() => {
        if (props.provider) {
            // console.log('account', props.provider.account)
        }
    }, [ props.provider ])

    return (
        <Header
            width={ props.isDesktop ? `${props.widthDesktop}px` : '100%' }
            before={
                <img src={logo} className="logo" onClick={() => history('/')} />
            }
            after={
                <div className="balance-full-block">
                    <div className="change_network">
                        <select value={props.typeNetwork} onChange={e => props.setTypeNetwork(e.target.value)}>
                            <option value="venom">Venom</option>
                            <option value="ever">Ever</option>
                        </select>
                    </div>
                    { props.typeNetwork === 'ever' ? <> {
                        props.everWallet && props.everWallet.account
                            ? <div className="balance-block">
                                <img src={user} className="logo-24" />
                                <div>
                                    <div style={{ fontSize: '14px' }}>{addStr(props.everWallet.account.address.toString())}</div>
                                    <div className='text-secondory'>{weiToEth(props.everWallet.balance, 9)} EVER</div>

                                </div>
                                <Button type="secondory" size='m' onClick={() => props.everWallet.logout()}>
                                    <img src={logout} className="logo-20"  />
                                </Button>
                            </div> : <div className="balance-block">
                                <Button type="default" size='l' onClick={() => props.everWallet.login()}>
                            Connect Ever
                                </Button>
                            </div>
                    } </> : null }

                    {props.typeNetwork === 'venom' && props.venomConnect
                        ? <> {props.address && props.balance ? <div className="balance-block">
                            <img src={user} className="logo-24" />
                            <div>
                                <div style={{ fontSize: '14px' }}>{addStr(props.address)}</div>
                                <div className='text-secondory'>{weiToEth(props.balance.toString(), 9)} VENOM</div>
                            </div>
                            <Button type="secondory" size='m' onClick={() => onDisconnectButtonClick()}>
                                <img src={logout} className="logo-20"  />
                            </Button>
                        </div> : <div className="balance-block">
                            <Button type="default" size='l' onClick={() => onConnectButtonClick()}>
                            Connect Venom
                            </Button>
                        </div>}
                        </> : null }
                </div>
            }
        >
            {!props.isMobile
                ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        type="tentery"
                        style={{ margin: '0 16px 0 16px' }}
                        onClick={() => history('/boards')}
                    >Boards</Button>
                    <Button type="tentery" style={{ margin: '0 16px 0 16px' }}>How to play</Button>
                    <Button type="tentery" style={{ margin: '0 16px 0 16px' }}>Get EVER</Button>
                </div> : null }

        </Header>
    )
}
