import { Address, hasEverscaleProvider, ProviderRpcClient } from 'everscale-inpage-provider'
import React, { createContext, useCallback, useEffect, useState } from 'react'

export interface Account {
    address: Address;
    publicKey: string;
    contractType: string;
}
export interface EverWallet {
    isInitializing: boolean,
    isConnected: boolean,
    hasProvider: boolean,
    selectedNetworkId: number,
    account: Account | undefined,
    balance: string,
    provider: ProviderRpcClient | undefined,
    login: Function,
    logout: Function
}

const InitialState = {
    isInitializing: true,
    isConnected: false,
    hasProvider: false,
    selectedNetworkId: 1,
    account: undefined,
    balance: '0',
    provider: undefined,
    login: () => null,
    logout: () => null
} as EverWallet

interface EverConf {
    children: any,
    ever: ProviderRpcClient
}

export const EverWalletContext = createContext(InitialState)
export function EverWalletProvider ({ children, ever }: EverConf): JSX.Element  {
    const [ account, setAccount ] = useState<any>(undefined)
    const [ hasProvider, setHasProvider ] = useState(false)
    const [ selectedNetworkId, setSelectedNetworkId ] = useState(1)
    const [ selectedNetworkType, setSelectedNetworkType ] = useState('mainnet')
    const [ isInitializing, setIsInitializing ] = useState(true)

    const [ balance, setBalance ] = useState<string>('0')

    const [ isConnectingInProgress, setIsConnectingInProgress ] = useState(false)

    const provider = ever

    // Initializing
    useEffect(() => {
        const initPipeline = async () => {
            // Check is we have provider
        //     const hasProvider2 = await hasEverscaleProvider()
        //     if (!hasProvider2) {
        //         setIsInitializing(false)
        //         return
        //     }

        //     await ever.ensureInitialized()

        //     // Subscribe for account connected
        //     const permissionsSubscriber = await ever.subscribe('permissionsChanged')
        //     permissionsSubscriber.on('data', (event) => {
        //         setAccount(event.permissions.accountInteraction)
        //         if (event.permissions.accountInteraction) {
        //             ever.getBalance(event.permissions.accountInteraction.address).then((balanceLocal) => {
        //                 setBalance(balanceLocal)
        //             })
        //         }
        //     })

        //     // Subscribe for network change
        //     const networkSubscriber = await ever.subscribe('networkChanged')
        //     networkSubscriber.on('data', (event) => {
        //         setSelectedNetworkId(event.networkId)
        //     })

        //     // Get current state
        //     const currentProviderState = await ever.getProviderState()
        //     // Current networkId
        //     setSelectedNetworkId(currentProviderState.networkId)
        //     setSelectedNetworkType(currentProviderState.selectedConnection)
        //     // Current account, can be undefined.
        //     setAccount(currentProviderState.permissions.accountInteraction)

        //     if (currentProviderState.permissions.accountInteraction) {
        //         const balanceLocal = await ever.getBalance(currentProviderState.permissions.accountInteraction.address)
        //         setBalance(balanceLocal)
        //     }
        //     // Yes we have provider
        //     setHasProvider(true)
        //     // Initialized;
        //     setIsInitializing(false)
        }

        initPipeline().catch((err) => {
            console.log('Ever wallet init error', err)
        })
    }, [])

    const login = useCallback(async () => {
        if (hasProvider && !isConnectingInProgress) {
            setIsConnectingInProgress(true)
            try {
                await ever.ensureInitialized()
                await ever.requestPermissions({ permissions: [ 'basic', 'accountInteraction' ] })
            } catch (e) {
                console.log('Connecting error', e)
            }
            setIsConnectingInProgress(false)
        }
    }, [ hasProvider, isConnectingInProgress ])

    const logout = useCallback(async () => {
        await ever.disconnect()
    }, [])

    const res = <EverWalletContext.Provider value={{
        isInitializing,
        isConnected: !isInitializing && !!account,
        hasProvider,
        selectedNetworkId,
        account,
        balance,
        provider,
        login,
        logout
    }}>
        {children}
    </EverWalletContext.Provider>

    return res
}
