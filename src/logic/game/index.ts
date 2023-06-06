import { AbiEventName, Address, Contract, DecodedEventWithTransaction, ProviderRpcClient } from 'everscale-inpage-provider'
import { Wallet } from 'logic/wallet'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { EverWallet } from '../wallet/hook'
import { useEverWallet } from '../wallet/useEverWallet'

import { gameAbi as abi } from './abi'

// import * as abi from '../../Game.abi.json'

// const gameAbi = abi

/* eslint-disable @typescript-eslint/naming-convention */
export interface VenomWallet {
    provider: ProviderRpcClient,
    address: string | undefined,
    balance: string | undefined,
    account: {
        address: Address | undefined
    },
    type: 'venom' | 'ever'
}

export interface PlayerMoved {
    board: Address,
    round: string,
    player: Address,
    from: {
        cell: string,
        coordinate: {
            x: string,
            y: string
        }
    },
    to: {
        cell: string,
        coordinate: {
            x: string,
            y: string
        }
    }

}
interface ParamConstruct {
    address: string,
    addressUser: string,
    wallet: EverWallet | VenomWallet | undefined
}

export interface ObjPixel {
    number: number,
    type: 'default' | 'portal-blue' | 'portal-red' | 'win',
    position: number[],
    portalInfo?: Portal
}

export interface Portal {
    id: number,
    type: 'blue' | 'red',
    rotate?: number,
    distance?: number,
    portals:
    {
        number: number,
        position: number[]
    }[]

}
interface Beam {
    from: {
        x: string,
        y: string
    },
    to: {
        x: string,
        y: string
    },
    type_: string
}
export interface InfoGame {
    _blueBeams: Beam[],
    _board: {
        columns: string
        rows: string
    },
    _redBeams: Beam[]
}

export interface Round {
    id: string,
    validUntil: string,
    moveDuration: string,
    status: string,
    maxPlayers: string,
    entryStake: string,
    prizeFund: string,
    prizeClaimed: boolean,
    winner: Address,
    giveUpAllowed: boolean,
    roundDuration: string,
    autoStartTimestamp: string | undefined | null,
    rake: string,
    rakeToJackpotRate: string
}

interface Seed {
    seed: string
}

interface Owner {
    value0: Address
}

interface PrizeFundPerRound {
    prizeFundPerRound: string
}

interface Jackpot {
    rakes: string,
    jackpot: string,
    roundTreasury: any
}

export interface Rounds {
    _rounds: Round[]
}

export interface InfoGames {
    info: (InfoGame | undefined),
    rounds: (Rounds | undefined),
    address: Address,
    seed: string,
    owner: string,
    balance: string,
    jackpot: string

}

export interface Player {
    address: Address,
    number: number
}

export type ContractType = Contract<typeof abi>
export type ContractEvents = 'RoundCreated'
| 'RoundFinished'
| 'RoundJoined'
| 'PlayerMoved'
| 'PlayerWon'
| 'PlayerRemovedFromRound'

// const portals: Portal[] = [
//     {
//         id: 1,
//         type: 'blue',
//         portals: [
//             { number: 6, position: [] },
//             { number: 45, position: [] }
//         ]
//     },
//     {
//         id: 2,
//         type: 'blue',
//         portals: [
//             { number: 12, position: [] },
//             { number: 43, position: [] }
//         ]
//     },
//     {
//         id: 3,
//         type: 'red',
//         portals: [
//             { number: 7, position: [] },
//             { number: 29, position: [] }
//         ]
//     },
//     {
//         id: 4,
//         type: 'red',
//         portals: [
//             { number: 35, position: [] },
//             { number: 81, position: [] }
//         ]
//     }
// ]

class Game {
    private _address: string

    private _addressUser: string

    private _wallet: EverWallet | VenomWallet | undefined

    constructor (params: ParamConstruct) {
        this._address = params.address
        this._addressUser = params.addressUser
        this._wallet = params.wallet

        console.log('_wallet', this._wallet)
    }

    public sunc (wallet: EverWallet | VenomWallet | undefined): true {
        this._wallet = wallet
        console.log('_wallet', this._wallet)
        return true
    }

    public static generatedCells (size: number): number[][] {
        const fullArr: number[][] = [] // y x
        const Max = size * size
        // console.log('size', size)

        for (let i = 0; i < size; i++) {
            let arrX: number[] = []
            for (let i2 = 0; i2 < size; i2++) {
                const num =  i2 + (i * size)
                arrX.push(num + 1)
            }

            if (i % 2) {
                arrX = arrX.reverse()
            }

            fullArr.push(arrX)
        }

        return fullArr
    }

    public static getNumberFromXY (x: number, y: number, size: number): number {
        const cells = this.generatedCells(size)

        try {
            // console.log('y, x', y, x)
            // console.log('cells', cells)
            // console.log('cells', cells[y][x])

            return cells[y - 1][x - 1]
        } catch (err) {
            console.error('getNumberFromXY', err)
            return 0
        }
    }

    public static beamsToPortal (beam: Beam[], size: number): Portal[] {
        const portal: Portal[] = []
        for (let i = 0; i < beam.length; i++) {
            portal.push({
                id: i,
                type: Number(beam[i].type_) === 1 ? 'blue' : 'red',
                portals: [
                    {
                        number: this.getNumberFromXY(Number(beam[i].from.x), Number(beam[i].from.y), size),
                        position: [Number(beam[i].from.x), Number(beam[i].from.y)]
                    },
                    {
                        number: this.getNumberFromXY(Number(beam[i].to.x), Number(beam[i].to.y), size),
                        position: [Number(beam[i].to.x), Number(beam[i].to.y)]
                    }
                ]
            })
        }

        return portal
    }

    public static genArrBoard (size: number, _portals: Beam[]): [ObjPixel[][], Portal[]] {
        const fullArr: ObjPixel[][] = []

        const Max = size * size

        const sizePixel = 44

        const fixPixel = 1

        const localPortals = this.beamsToPortal(_portals, size)

        const portals = this.beamsToPortal(_portals, size)

        for (let i = 0; i < size; i++) {
            let arrX: ObjPixel[] = []
            for (let i2 = 0; i2 < size; i2++) {
                const num =  Max - i2 - (i * size) // 10

                const typePortal = portals.filter(
                    p => p.portals[0].number === num || p.portals[1].number === num
                )

                let type = typePortal.length > 0 ? 'portal-' + typePortal[0].type : 'default'

                if (type !== 'default') {
                    const indexPortal = portals.findIndex(
                        p => p.portals[0].number === num || p.portals[1].number === num
                    )

                    const numOfPortal = typePortal[0].portals[0].number === num ? 0 : 1

                    // console.log((i % 2 ? size - i2 : i2 + 1) - 1, (size - i) - 1, localPortals[indexPortal])

                    console.log((i % 2 ? size - i2 : i2 + 1) - 1, (size - i) - 1, localPortals[indexPortal])
                    // localPortals[indexPortal].portals[numOfPortal].position = [ (i % 2 ? size - i2 : i2 + 1) - 1, (size - i) - 1 ] // x y
                }

                if (num === Max) type = 'win'

                arrX.push({
                    number: num,
                    type: type as ObjPixel['type'],
                    position: [ i, i2 ]
                })
            }

            if (i % 2) {
                arrX = arrX.reverse()
            }

            fullArr.push(arrX)
        }

        for (let i = 0; i < localPortals.length; i++) {
            if (localPortals[i].portals[0].position.length > 0) {
                const aX = localPortals[i].portals[0].position[0] * sizePixel - (sizePixel / 2) - fixPixel
                const aY = localPortals[i].portals[0].position[1] * sizePixel - (sizePixel / 2) - fixPixel

                const bX = localPortals[i].portals[1].position[0] * sizePixel - (sizePixel / 2) + fixPixel
                const bY = localPortals[i].portals[1].position[1] * sizePixel - (sizePixel / 2) + fixPixel

                const abY = aY - bY
                const abX = aX - bX
                const an =  Math.atan2(abY, abX)

                localPortals[i].rotate = -((an * 180) / Math.PI)

                // localPortals[i].distance = Math.sqrt(((bX - aX) ** 2) + ((bY - aY) ** 2))

                localPortals[i].distance = Math.sqrt((aX - bX) ** 2 + (aY - bY) ** 2)

                // fullArr.filter((f) => {
                //     const ff = f.filter(f2 => f2.number === localPortals[i].portals[0].number
                //     || f2.number === localPortals[i].portals[1].number)

                //     if (ff) {
                //         return
                //     }
                // })
            }
        }

        console.log('localPortals', localPortals)

        return [ fullArr, localPortals ]
    }

    public async getAllGames (): Promise<Address[] | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined

        const codeHash = await axios.get('https://cpapi.mazekine.com/contractHash')
        console.log('codeHash', codeHash)
        if (!codeHash.data) return undefined
        try {
            const addresses = await this._wallet.provider
                .getAccountsByCodeHash({ codeHash: codeHash.data })

            console.log('addresses.accounts', addresses.accounts)

            console.log('Provider connect', this._wallet.provider)
            return addresses.accounts
        } catch (error) {
            console.error(error)
            return []
        }
    }

    public async getRounds (address: Address): Promise<Rounds | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined
        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.getRounds({ answerId: 0, status: null } as never)

            const data = await getData.call()

            console.log('rounds', data)
            return data as Rounds
        } catch (error) {
            console.log('getRounds', error)
            return undefined
        }
    }

    public async getInfoForGames (address: Address): Promise<InfoGame | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.getBoard({ answerId: 0 } as never)

            const data = await getData.call()

            console.log('board', data)
            return data as InfoGame
        } catch (error) {
            console.log('getInfoForGames', error)
            return undefined
        }
    }

    public async getSeed (address: Address): Promise<Seed | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.seed({ } as never)

            const data = await getData.call()

            console.log('getSeed', data)
            return data as Seed
        } catch (error) {
            console.log('getSeed', error)
            return undefined
        }
    }

    public async getOwner (address: Address): Promise<Owner | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.owner({ answerId: 0 } as never)

            const data = await getData.call()

            console.log('getOwner', data)
            return data as Owner
        } catch (error) {
            console.log('getOwner', error)
            return undefined
        }
    }

    public async getPrizeFundPerRound (address: Address): Promise<PrizeFundPerRound | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) return undefined

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.prizeFundPerRound({ } as never)

            const data = await getData.call()

            console.log('getPrizeFundPerRound', data)
            return data as PrizeFundPerRound
        } catch (error) {
            console.log('getPrizeFundPerRound', error)
            return undefined
        }
    }

    public async createRound (address: Address): Promise<true | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider || !this._wallet.account) {
            console.log('createRound not start', this._wallet)
            return undefined
        }
        if (!this._wallet.account.address) return undefined

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.createRound({ } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(0.2).shiftedBy(9).toFixed(0),
                bounce: true
            })

            // data.

            // const data = await getData.call()

            console.log('createRound', data)
            return true
        } catch (error) {
            console.log('createRound', error)
            return undefined
        }
    }

    public async giveUp (address: Address): Promise<true | undefined> {
        if (!this._wallet || !this._wallet.provider || !this._wallet.account || !this._wallet.account.address) {
            console.log('giveUp not start', this._wallet)
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.giveUpAllowed({ } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(0.2).shiftedBy(9).toFixed(0),
                bounce: true
            })

            // data.

            // const data = await getData.call()

            console.log('giveUp', data)
            return true
        } catch (error) {
            console.log('giveUp', error)
            return undefined
        }
    }

    public async joinRound (address: Address, roundId: string): Promise<true | undefined> {
        if (!this._wallet || !this._wallet.provider || !this._wallet.account || !this._wallet.provider || !this._wallet.account.address) {
            console.log('joinRound not start', this._wallet)
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.joinRound({ roundId } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(0.2).shiftedBy(9).toFixed(0),
                bounce: true
            })

            // data.

            // const data = await getData.call()

            console.log('joinRound', data)
            return true
        } catch (error) {
            console.log('joinRound', error)
            return undefined
        }
    }

    public async startRoll (address: Address): Promise<true | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.account) return undefined
        if (!this._wallet.provider) return undefined
        if (!this._wallet.account.address) {
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.roll({ } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(0.3).shiftedBy(9).toFixed(0),
                bounce: true
            })

            console.log('startRoll', data)
            return true
        } catch (error) {
            console.log('startRoll', error)
            return undefined
        }
    }

    public async claim (address: Address, round: string): Promise<true | undefined> {
        if (!this._wallet || !this._wallet.provider || !this._wallet.account || !this._wallet.provider || !this._wallet.account.address) {
            console.log('claim not start', this._wallet)
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.claim({ roundId: round } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(0.3).shiftedBy(9).toFixed(0),
                bounce: true
            })

            console.log('claim', data)
            return true
        } catch (error) {
            console.log('claim', error)
            return undefined
        }
    }

    public async getPlayerCell (address: Address): Promise<(readonly [Address, string])[] | undefined> {
        if (!this._wallet || !this._wallet.provider) {
            console.log('error getPlayerCell')
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const data = await contractGame.fields.playerCell()

            console.log('getPlayerCell', data)
            return data
        } catch (error) {
            console.log('getPlayerCell', error)
            return undefined
        }
    }

    public async getPlayersForRound (address: Address, id: string): Promise<Player[] | undefined> {
        if (!this._wallet || !this._wallet.provider) {
            console.log('error getPlayersForRound')
            return undefined
        }
        console.log('start getPlayersForRound')

        const plR = await this.getRoundsPlayers(address)
        const plC = await this.getPlayerCell(address)

        if (!plR || !plC) return undefined

        const players: Player[] = []

        try {
            const findRound = plR.filter(pl => pl[0] === id)

            let usersForRound: Address[] = []
            if (findRound.length !== 0) usersForRound = findRound[0][1]

            for (let i = 0; i < usersForRound.length; i++) {
                const numberPlayer = plC.filter(pl => pl[0].toString() === usersForRound[i].toString())
                if (numberPlayer.length === 0) break

                const player: Player = {
                    address: usersForRound[i],
                    number: Number(numberPlayer[0][1])
                }

                players.push(player)
            }

            return players
        } catch (error) {
            console.log('getPlayersForRound', error)
            return undefined
        }
    }

    public async getRoundsPlayers (address: Address): Promise<(readonly [string, Address[]])[] | undefined> {
        if (!this._wallet || !this._wallet.provider) {
            console.log('error getRoundsPlayers')
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const data = await contractGame.fields.roundPlayers()

            console.log('getRoundsPlayers', data)
            return data
        } catch (error) {
            console.log('getRoundsPlayers', error)
            return undefined
        }
    }

    public async getJackpot (address: Address): Promise<Jackpot | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) {
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const data = await contractGame.fields.boardTreasury()

            console.log('getJackpot', data)
            return data
        } catch (error) {
            console.log('getJackpot', error)
            return undefined
        }
    }

    public async getPlayerRound (address: Address): Promise<(readonly [Address, string])[] | undefined> {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) {
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const data = await contractGame.fields.playerRound()

            console.log('getPlayerRound', data)
            return data
        } catch (error) {
            console.log('getPlayerRound', error)
            return undefined
        }
    }

    public async getBalance (address: Address): Promise<string | undefined> {
        if (!this._wallet || !this._wallet.provider) {
            console.log('getBalance error')
            return undefined
        }

        try {
            const balance = await this._wallet.provider.getBalance(address)

            console.log('getBalance', balance)
            return balance
        } catch (error) {
            console.log('getBalance', error)
            return undefined
        }
    }


    public async getAllInfoGames (addresses: Address[]): Promise<InfoGames[] | undefined> {
        const allInfo = []
        const allRounds = []
        const allseed = []
        const allowner = []
        const balance = []
        const jackpot = []

        for (let i = 0; i < addresses.length; i++) {
            allInfo.push(this.getInfoForGames(addresses[i]))
            allRounds.push(this.getRounds(addresses[i]))
            allseed.push(this.getSeed(addresses[i]))
            allowner.push(this.getOwner(addresses[i]))
            balance.push(this.getBalance(addresses[i]))
            jackpot.push(this.getJackpot(addresses[i]))
        }

        const allPromise = [
            Promise.all(allInfo),
            Promise.all(allRounds),
            Promise.all(allseed),
            Promise.all(allowner),
            Promise.all(balance),
            Promise.all(jackpot)
        ]
        const allPromiseData = await Promise.all(allPromise)
        const infos = allPromiseData[0] as (InfoGame | undefined)[]
        const rounds = allPromiseData[1] as (Rounds | undefined)[]
        const seeds = allPromiseData[2] as (Seed | undefined)[]
        const owners = allPromiseData[3] as (Owner | undefined)[]
        const balances = allPromiseData[4] as (string | undefined)[]
        const jackpots = allPromiseData[5] as (Jackpot | undefined)[]
        // const infos = await Promise.all(allInfo)
        // const rounds = await Promise.all(allRounds)
        // const seeds = await Promise.all(allseed)
        // const owners = await Promise.all(allowner)

        const data: InfoGames[] = []
        for (let i = 0; i < infos.length; i++) {
            data.push({
                info: infos[i],
                rounds: rounds[i],
                address: addresses[i],
                seed: seeds[i]?.seed ?? '',
                owner: owners[i]?.value0.toString() ?? '',
                balance: balances[i] ?? '',
                jackpot: jackpots[i]?.jackpot ?? ''
            })
        }

        return data
    }

    public onEvents (address: Address, cb: Function): true | undefined {
        if (!this._wallet) return undefined
        if (!this._wallet.provider) {
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const subscriber = contractGame.events(new this._wallet.provider!.Subscriber())

            subscriber.on((event) => {
                cb(event.event, event.data)
                console.log('Event: ', event)
            })

            console.log('onEvents', subscriber)
            return true
        } catch (error) {
            console.log('onEvents', error)
            return undefined
        }
    }
}

export { Game }
