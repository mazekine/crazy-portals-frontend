import React, { useEffect } from 'react'

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import './style.css'
import { Button, AppRoot, View, Panel, Div } from './components'
import { HeaderBlock } from './layout/header'
import { FooterBlock } from './layout/footer'

import { Main } from './pages/main'
import { Boards } from './pages/boards'
import { Board } from './pages/board'
import { Round } from './pages/board/round'
import { useEverWallet } from './logic/wallet/useEverWallet'
import { Game } from './logic/game'

const widthDesktop = 1160

const widthMobile = 750

export const App: React.FC = () => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ isDesktop, setIsDesktop ] = React.useState<boolean>(window.innerWidth >= widthDesktop)

    const [ isMobile, setIsMobile ] = React.useState<boolean>(window.innerWidth <= widthMobile)

    const [ modal, setModal ] = React.useState<any | undefined>(undefined)

    const everWallet = useEverWallet()

    const location = useLocation()

    const history = useNavigate()

    // const provider = new Wallet()

    function openModal (type: 'load' | 'close') {
        if (type === 'load') {
            setModal(<div className="modal">
                <div className="loadModal">
                    <h3>Wait transaction</h3>
                </div>
            </div>)
        } else if (type === 'close') {
            setModal(undefined)
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
                        />
                    }/>
                </Routes>
            </View>
        </AppRoot>
    )
}
