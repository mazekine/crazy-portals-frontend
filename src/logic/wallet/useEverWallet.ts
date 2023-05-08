/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from 'react'
import { EverWallet, EverWalletContext } from './hook'

export function useEverWallet (): EverWallet {
    const { isInitializing, isConnected, hasProvider, selectedNetworkId, account, balance, login, logout } = useContext(EverWalletContext)
    return { isInitializing, isConnected, hasProvider, selectedNetworkId, account, balance, login, logout }
}
