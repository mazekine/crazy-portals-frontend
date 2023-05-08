import { Address, hasEverscaleProvider, ProviderRpcClient } from 'everscale-inpage-provider'
import React from 'react'

interface Account {
    address: Address;
    publicKey: string;
    contractType: string;
}

export class Wallet {
    private _ever: ProviderRpcClient

    private _setEver: React.Dispatch<React.SetStateAction<ProviderRpcClient>>

    private _networkId: number

    private _networkType: 'mainnet' | 'testnet'

    private _hasEverscaleProvider: boolean = false

    private _account: Account | undefined

    private _setAccount: React.Dispatch<React.SetStateAction<Account | undefined>>

    private _isInitializing: boolean = false

    constructor (networkId: number = 42, networkType: 'mainnet' | 'testnet' = 'testnet') {
        const [ account, setAccount ] = React.useState<Account | undefined>(undefined)
        const [ ever, setEver ] = React.useState<ProviderRpcClient>(new ProviderRpcClient())

        this._account = account
        this._setAccount = setAccount

        this._ever = ever
        this._setEver = setEver

        this._networkType = networkType
        this._networkId = networkId

        this.init()
    }

    public async init (): Promise<Wallet> {
        this._hasEverscaleProvider = await hasEverscaleProvider()
        if (this._hasEverscaleProvider) {
            await this._ever.ensureInitialized()

            // Subscribe for account connected
            const permissionsSubscriber = await this._ever.subscribe('permissionsChanged')
            permissionsSubscriber.on('data', (event) => {
                this._setAccount(event.permissions.accountInteraction)

            // console.log('account', this._account)
            })

            // Subscribe for network change
            const networkSubscriber = await this._ever.subscribe('networkChanged')
            networkSubscriber.on('data', (event) => {
                this._networkId = event.networkId
            })

            const currentProviderState = await this._ever.getProviderState()

            // Current networkId
            this._networkId = currentProviderState.networkId
            this._networkType = currentProviderState.selectedConnection as 'mainnet' | 'testnet'

            // Current account, can be undefined.
            this._setAccount(currentProviderState.permissions.accountInteraction)

            // Yes we have provider
            this._hasEverscaleProvider = true

            // Initialized
            this._isInitializing = true
        }
        return this
    }

    public async connect (): Promise<boolean> {
        if (this._hasEverscaleProvider) {
            try {
                await this._ever.ensureInitialized()
                await this._ever.requestPermissions({ permissions: [ 'basic', 'accountInteraction' ] })

                return true
            } catch (e) {
                console.log('Connecting error', e)
                return false
            }
        }
        return false
    }

    public get account (): Account | undefined {
        return this._account
    }

    public get ever (): ProviderRpcClient {
        return this._ever
    }

    public get isInitializing (): boolean {
        return this._isInitializing
    }
}
