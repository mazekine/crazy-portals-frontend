import React from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ProviderRpcClient } from 'everscale-inpage-provider'

import { App } from './App'

import { EverWalletProvider } from './logic/wallet/hook'


const provider = new ProviderRpcClient()

const el = document.createElement('div')
document.body.appendChild(el)

// eruda.init({
//     container: el,
//     tool: [ 'console', 'elements' ]
// })

ReactDOM.render(
    <BrowserRouter
        basename='/'
    >
        <React.StrictMode>
            <EverWalletProvider ever={provider}>
                <App />
            </EverWalletProvider>
        </React.StrictMode>
    </BrowserRouter>,
    document.querySelector('#root')
)
