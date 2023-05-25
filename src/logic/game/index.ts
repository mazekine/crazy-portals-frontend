import { Address } from 'everscale-inpage-provider'
import { Wallet } from 'logic/wallet'
import BigNumber from 'bignumber.js'
import { EverWallet } from '../wallet/hook'
import { useEverWallet } from '../wallet/useEverWallet'

import { gameAbi as abi } from './abi'
import axios from 'axios'

// import * as abi from '../../Game.abi.json'

// const gameAbi = abi

/* eslint-disable @typescript-eslint/naming-convention */
interface ParamConstruct {
    address: string,
    addressUser: string,
    wallet: EverWallet
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

interface Round {
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

export interface Rounds {
    _rounds: Round[]
}

export interface InfoGames {
    info: (InfoGame | undefined),
    rounds: (Rounds | undefined),
    address: Address,
    seed: string,
    owner: string

}

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

    private _wallet: EverWallet

    constructor (params: ParamConstruct) {
        this._address = params.address
        this._addressUser = params.addressUser
        this._wallet = params.wallet
    }

    public sunc (wallet: EverWallet): true {
        this._wallet = wallet
        return true
    }

    public static generatedCells (size: number): number[][] {
        const fullArr: number[][] = [] // y x
        const Max = size * size

        for (let i = 0; i < size; i++) {
            let arrX: number[] = []
            for (let i2 = 0; i2 < size; i2++) {
                const num =  i2 + (i * size)
                arrX.push(num)
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
            console.log('getNumberFromXY', err)
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
                        position: []
                    },
                    {
                        number: this.getNumberFromXY(Number(beam[i].to.x), Number(beam[i].to.y), size),
                        position: []
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

                const type = typePortal.length > 0 ? 'portal-' + typePortal[0].type : 'default'

                if (type !== 'default') {
                    const indexPortal = portals.findIndex(
                        p => p.portals[0].number === num || p.portals[1].number === num
                    )

                    const numOfPortal = typePortal[0].portals[0].number === num ? 0 : 1

                    console.log((i % 2 ? size - i2 : i2 + 1) - 1, (size - i) - 1, localPortals[indexPortal])
                    localPortals[indexPortal].portals[numOfPortal].position = [ (i % 2 ? size - i2 : i2 + 1) - 1, (size - i) - 1 ] // x y
                }

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
        if (!this._wallet.provider) return undefined

        const codeHash = await axios.get('https://cpapi.mazekine.com/contractHash')
        console.log(codeHash)
        if (!codeHash.data) return undefined
        const addresses = await this._wallet.provider
            .getAccountsByCodeHash({ codeHash: codeHash.data })

        console.log('addresses.accounts', addresses.accounts)
        return addresses.accounts
    }

    public async getRounds (address: Address): Promise<Rounds | undefined> {
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
        if (!this._wallet.provider || !this._wallet.account) {
            console.log('createRound not start', this._wallet)
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.createRound({ answerId: 0 } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(1).shiftedBy(9).toFixed(0),
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

    public async joinRound (address: Address, roundId: string): Promise<true | undefined> {
        if (!this._wallet.provider || !this._wallet.account) {
            console.log('joinRound not start', this._wallet)
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.joinRound({ answerId: 0, roundId } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(1).shiftedBy(9).toFixed(0),
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
        if (!this._wallet.provider || !this._wallet.account) {
            return undefined
        }

        const contractGame = new this._wallet.provider.Contract(abi, address)

        try {
            const getData = contractGame.methods.roll({ answerId: 0 } as never)

            const data = await getData.send({
                from: this._wallet.account.address,
                amount: new BigNumber(1).shiftedBy(9).toFixed(0),
                bounce: true
            })

            console.log('startRoll', data)
            return true
        } catch (error) {
            console.log('startRoll', error)
            return undefined
        }
    }

    public async getPlayerCell (address: Address): Promise<(readonly [Address, string])[] | undefined> {
        if (!this._wallet.provider || !this._wallet.account) {
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

    public async getPlayerRound (address: Address): Promise<(readonly [Address, string])[] | undefined> {
        if (!this._wallet.provider || !this._wallet.account) {
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

    public async getAllInfoGames (addresses: Address[]): Promise<InfoGames[] | undefined> {
        const allInfo = []
        const allRounds = []
        const allseed = []
        const allowner = []

        for (let i = 0; i < addresses.length; i++) {
            allInfo.push(this.getInfoForGames(addresses[i]))
            allRounds.push(this.getRounds(addresses[i]))
            allseed.push(this.getSeed(addresses[i]))
            allowner.push(this.getOwner(addresses[i]))
        }

        const allPromise = [
            Promise.all(allInfo),
            Promise.all(allRounds),
            Promise.all(allseed),
            Promise.all(allowner)
        ]
        const allPromiseData = await Promise.all(allPromise)
        const infos = allPromiseData[0] as (InfoGame | undefined)[]
        const rounds = allPromiseData[1] as (Rounds | undefined)[]
        const seeds = allPromiseData[2] as (Seed | undefined)[]
        const owners = allPromiseData[3] as (Owner | undefined)[]
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
                owner: owners[i]?.value0.toString() ?? ''
            })
        }

        return data
    }
}

export { Game }
