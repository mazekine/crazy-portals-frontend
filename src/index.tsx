import React from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ProviderRpcClient } from 'everscale-inpage-provider'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'

import { App } from './App'

import { EverWalletProvider } from './logic/wallet/hook'

const provider = new ProviderRpcClient({
    fallback: () => EverscaleStandaloneClient.create({
        connection: {
            id: 2, // network id
            type: 'graphql',
            data: {
                // create your own project at https://dashboard.evercloud.dev
                endpoints: [ 'https://mainnet.evercloud.dev/ef45648dfd964b85b1476c3dfee79d11/graphql' ]
            }
        }
    })
})

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
