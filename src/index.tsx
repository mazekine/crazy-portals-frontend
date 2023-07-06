/* eslint-disable no-await-in-loop */
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

// document.querySelectorAll('a.bloko-button_kind-success').forEach((k, key) => {
//     setTimeout(() => {
//         console.log(k)
//         k.click()
//     }, 200 * key)
// })
// document.querySelectorAll('button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view:not(.artdeco-button--muted)').forEach((k, key) => {
//     k.click()
// })

// const sleep = ms => new Promise(r => setTimeout(r, ms))
// const list = document.querySelectorAll('.scaffold-layout__list-container li.ember-view a')

// for (let i = 0; i < list.length; i++) {
//     await sleep(1000)
//     try {
//         console.log('1 ok')
//         list[i].click()
//         await sleep(2000)
//     } catch (err) {
//         console.log(err)
//         console.log('1', list[i])
//         continue
//     }
//     //
//     try {
//         console.log('2 ok')
//         document.querySelector('button.jobs-apply-button.ember-view').click()
//         await sleep(400)
//     } catch (err) {
//         console.log(err)
//         console.log('2', list[i])
//         continue
//     }
//     //
//     try {
//         console.log('3 ok')
//         document.querySelector('button.artdeco-button--primary.ember-view').click()
//         await sleep(100)
//         document.querySelector('button.artdeco-button--primary.ember-view').click()
//         await sleep(100)
//         document.querySelector('button.artdeco-button--primary.ember-view').click()
//         await sleep(100)
//         document.querySelector('button.artdeco-button--primary.ember-view').click()
//         await sleep(200)
//         document.querySelector('button.artdeco-button--primary.ember-view').click()
//         await sleep(200)
//     } catch (err) {
//         console.log(err)
//         console.log('3', list[i])
//         continue
//     }
//     //
//     try {
//         console.log('4 ok')
//         document.querySelector('button.artdeco-modal__dismiss').click()
//         await sleep(100)
//         document.querySelector('button[data-control-name=discard_application_confirm_btn]').click()

//         await sleep(100)
//     } catch (err) {
//         console.log(err)
//         console.log('4', list[i])
//         continue
//     }
// }

// document.querySelectorAll('.scaffold-layout__list-container li').forEach((k, key) => {
//     k.click()
// })

// const el = document.createElement('div')
// document.body.appendChild(el)

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
