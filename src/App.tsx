/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react'

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { VenomConnect } from 'venom-connect'

import './style.css'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'
import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { Button, AppRoot, View, Panel, Div } from './components'
import { HeaderBlock } from './layout/header'
import { FooterBlock } from './layout/footer'

import { Main } from './pages/main'
import { Boards } from './pages/boards'
import { Board } from './pages/board'
import { Round } from './pages/board/round'
import { useEverWallet } from './logic/wallet/useEverWallet'
import { Game, VenomWallet } from './logic/game'

import load from './img/load.gif'
import { StorageGame } from './logic/storage'

const widthDesktop = 1160

const widthMobile = 750

const initTheme = 'light' as const

const standaloneFallback = () => EverscaleStandaloneClient.create({
    connection: {
        id: 1002,
        group: 'venom_testnet',
        type: 'jrpc',
        data: { endpoint: 'https://jrpc-devnet.venom.foundation/' }
    }
})

const initVenomConnect = async () => new VenomConnect({
    theme: initTheme,
    checkNetworkId: [ 42, 1000, 1002 ],
    providersOptions: {

        venomwallet: {
            links: {
                extension: [
                    {
                        browser: 'chrome',
                        link: 'https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch'
                    }, {
                        browser: 'chrome',
                        link: 'https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk'
                    }, {
                        browser: 'firefox',
                        link: 'https://addons.mozilla.org/en-US/firefox/addon/ever-wallet'
                    }
                ],
                android: undefined,
                ios: null
            },
            walletWaysToConnect: [
                {
                    package: ProviderRpcClient,
                    packageOptions: {
                        fallback: VenomConnect.getPromise('venomwallet', 'extension') || (() => Promise.reject()),
                        forceUseFallback: true
                    },
                    id: 'extension',
                    type: 'extension'
                }
            ],
            defaultWalletWaysToConnect: [ 'mobile', 'ios', 'android' ]
        },

        everwallet: {
            links: {
                extension: [
                    {
                        browser: 'chrome',
                        link: 'https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk'
                    }, {
                        browser: 'firefox',
                        link: 'https://addons.mozilla.org/en-US/firefox/addon/ever-wallet'
                    }
                ],
                android: 'https://play.google.com/store/apps/details?id=com.broxus.crystal.app',
                ios: 'https://apps.apple.com/us/app/ever-wallet-everscale/id1581310780'
            },
            walletWaysToConnect: [
                {
                    package: ProviderRpcClient,
                    packageOptions: {
                        fallback: VenomConnect.getPromise('everwallet', 'extension') || (() => Promise.reject()),
                        forceUseFallback: true
                    },
                    id: 'extension',
                    type: 'extension'
                }
            ],
            defaultWalletWaysToConnect: [ 'mobile', 'ios', 'android' ]
        }
    }
})

export const App: React.FC = () => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ isDesktop, setIsDesktop ] = React.useState<boolean>(window.innerWidth >= widthDesktop)

    const [ isMobile, setIsMobile ] = React.useState<boolean>(window.innerWidth <= widthMobile)

    const [ modal, setModal ] = React.useState<any | undefined>(undefined)
    const [ load1, setLoad ] = React.useState<boolean>(false)

    const [ typeNetwork, setTypeNetwork ] = React.useState<'venom' | 'ever'>('venom')

    const [ networkId, setNetworkId ] = React.useState<number>(42)

    const [ nameNetwork, setNameNetwork ] = React.useState<'venom' | 'ever'>('ever')

    const [ venomConnect, setVenomConnect ] = React.useState<VenomConnect | undefined>()
    const [ venomWallet, setVenomWallet ] = React.useState<VenomWallet | undefined>()
    const [ venomProvider, setVenomProvider ] = React.useState<any>()
    const [ address, setAddress ] = React.useState()
    const [ balance, setBalance ] = React.useState()
    const [ theme, setTheme ] = React.useState(initTheme)
    const [ info, setInfo ] = React.useState('')
    const [ standaloneMethodsIsFetching, setStandaloneMethodsIsFetching ] =    React.useState(false)

    const everWallet = useEverWallet()

    const location = useLocation()

    const history = useNavigate()

    // const provider = new Wallet()

    const storage = new StorageGame()

    const getNetwork = async (provider: any) => {
        const providerState = await provider?.getProviderState?.()
        const networkId2 = providerState.networkId.toString()

        console.log('networkId2', networkId2)

        setNameNetwork(Number(networkId2) === 42 ? 'ever' : 'venom')

        setNetworkId(Number(networkId2))
    }

    const getAddress = async (provider: any) => {
        const providerState = await provider?.getProviderState?.()

        const address2 = providerState?.permissions.accountInteraction?.address.toString()

        getNetwork(provider)

        return address2
    }

    const getBalance = async (provider: any, _address: string) => {
        try {
            const providerBalance = await provider?.getBalance?.(_address)

            return providerBalance
        } catch (error) {
            return undefined
        }
    }

    const checkAuth = async (_venomConnect: any) => {
        const auth = await _venomConnect?.checkAuth()
        if (auth) await getAddress(_venomConnect)
    }

    const onInitButtonClick = async () => {
        const initedVenomConnect = await initVenomConnect()
        setVenomConnect(initedVenomConnect)

        console.log('venomConnect', initedVenomConnect)

        await checkAuth(initedVenomConnect)
    }

    const check = async (_provider: any) => {
        const _address = _provider ? await getAddress(_provider) : undefined
        const _balance =          _provider && _address ? await getBalance(_provider, _address) : undefined

        setAddress(_address)
        setBalance(_balance)

        if (_provider && _address) {
            setTimeout(() => {
                check(_provider)
            }, 2000)
        }
    }

    const onConnect = async (provider: any) => {
        setVenomProvider(provider)

        console.log('providerVenom', provider)

        check(provider)
    }

    function openModal (type: 'load' | 'close') {
        if (type === 'load') {
            setLoad(true)
            // setModal(<div className="modal">
            //     <div className="loadModal">
            //         <h3>Wait transaction</h3>
            //         <img src={load} />
            //     </div>
            // </div>)
        } else if (type === 'close') {
            setModal(undefined)
            setLoad(false)
        }
    }

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
            // provider.init()

            window.addEventListener('resize', () => {
                setIsDesktop(window.innerWidth >= widthDesktop)
                setIsMobile(window.innerWidth <= widthMobile)
            })

            onInitButtonClick()

            const network = storage.get('network')
            if (network && network !== '') {
                setTypeNetwork(network)
            }
        }
    }, [])

    useEffect(() => {
        setVenomWallet({
            provider: venomProvider,
            address,
            balance,
            account: { address: address ? new Address(address) : undefined },
            type: typeNetwork
        })
    }, [ venomConnect, venomProvider, address, balance, typeNetwork ])

    useEffect(() => {
        const off = venomConnect?.on('connect', onConnect)

        return () => {
            off?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ venomConnect ])

    useEffect(() => {
        window.scrollBy(0, -100000)
    }, [ location.pathname ])

    useEffect(() => {
        storage.save('network', typeNetwork)
    }, [ typeNetwork ])

    return (
        <AppRoot

            header={<HeaderBlock
                isDesktop={isDesktop}
                widthDesktop={widthDesktop}
                isMobile={isMobile}
                everWallet={everWallet}
                typeNetwork={typeNetwork}
                venomConnect={venomConnect}
                venomProvider={venomProvider}
                address={address}
                balance={balance}
                setTypeNetwork={setTypeNetwork}
                networkId={networkId}
                // provider={provider}
            />}
            footer={<FooterBlock isDesktop={isDesktop} widthDesktop={widthDesktop} isMobile={isMobile} />}
            modal={modal}
        >
            <View
                id="main"
                width={ isDesktop ? `${widthDesktop}px` : '100%' }

            >
                <Routes>
                    <Route path="/" element={
                        <Main
                            id={'home'}
                            isDesktop={isDesktop}
                            widthDesktop={widthDesktop}
                            isMobile={isMobile}
                        />
                    }/>

                    <Route path="/boards" element={
                        <Boards
                            id={'boards'}
                            isDesktop={isDesktop}
                            widthDesktop={widthDesktop}
                            isMobile={isMobile}
                            everWallet={everWallet}
                            openModal={openModal}
                            venomWallet={venomWallet}
                            typeNetwork={typeNetwork}
                            nameNetwork={nameNetwork}
                        />
                    }/>

                    <Route path="/boards/:address" element={
                        <Board
                            id={'board'}
                            isDesktop={isDesktop}
                            widthDesktop={widthDesktop}
                            isMobile={isMobile}
                            everWallet={everWallet}
                            openModal={openModal}
                            venomWallet={venomWallet}
                            typeNetwork={typeNetwork}
                            load1={load1}
                            nameNetwork={nameNetwork}
                        />
                    }/>
                    <Route path="/boards/:address/:round" element={
                        <Round
                            id={'round'}
                            isDesktop={isDesktop}
                            widthDesktop={widthDesktop}
                            isMobile={isMobile}
                            everWallet={everWallet}
                            openModal={openModal}
                            venomWallet={venomWallet}
                            typeNetwork={typeNetwork}
                            load1={load1}
                            nameNetwork={nameNetwork}
                        />
                    }/>
                </Routes>
            </View>
        </AppRoot>
    )
}
