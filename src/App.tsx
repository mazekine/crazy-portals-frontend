import React, { useEffect } from 'react'

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import './style.css'
import { Button, AppRoot, View, Panel, Div } from './components'
import { HeaderBlock } from './layout/header'
import { FooterBlock } from './layout/footer'

import { Main } from './pages/main'
import { Boards } from './pages/boards'
import { Wallet } from './logic/wallet'
import { useEverWallet } from './logic/wallet/useEverWallet'

const widthDesktop = 1100

const widthMobile = 750

export const App: React.FC = () => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ isDesktop, setIsDesktop ] = React.useState<boolean>(window.innerWidth >= widthDesktop)

    const [ isMobile, setIsMobile ] = React.useState<boolean>(window.innerWidth <= widthMobile)

    const everWallet = useEverWallet()

    const location = useLocation()

    const history = useNavigate()

    // const provider = new Wallet()

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
            // provider.init()

            window.addEventListener('resize', () => {
                setIsDesktop(window.innerWidth >= widthDesktop)
                setIsMobile(window.innerWidth <= widthMobile)
            })
        }
    }, [])

    useEffect(() => {
        window.scrollBy(0, -100000)
    }, [ location.pathname ])

    return (
        <AppRoot

            header={<HeaderBlock
                isDesktop={isDesktop}
                widthDesktop={widthDesktop}
                isMobile={isMobile}
                everWallet={everWallet}
                // provider={provider}
            />}
            footer={<FooterBlock isDesktop={isDesktop} widthDesktop={widthDesktop} isMobile={isMobile} />}
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
                        />
                    }/>
                </Routes>
            </View>
        </AppRoot>
    )
}
