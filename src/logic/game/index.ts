import { Address } from 'everscale-inpage-provider'
import { Wallet } from 'logic/wallet'
import { EverWallet } from 'logic/wallet/hook'

import * as abi from '../../Game.abi.json'

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
    winner: Address
}

export interface Rounds {
    _rounds: Round[]
}

export interface InfoGames {
    info: (InfoGame | undefined),
    rounds: (Rounds | undefined),
    address: Address

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
        const addresses = await this._wallet.provider
            .getAccountsByCodeHash({ codeHash: '420707736665c98b182d54d70269026947acb31781d8e6d279d366a1653d1949' })

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

    public async getAllInfoGames (addresses: Address[]): Promise<InfoGames[] | undefined> {
        const allInfo = []
        const allRounds = []

        for (let i = 0; i < addresses.length; i++) {
            allInfo.push(this.getInfoForGames(addresses[i]))
            allRounds.push(this.getRounds(addresses[i]))
        }
        const infos = await Promise.all(allInfo)
        const rounds = await Promise.all(allRounds)

        const data: InfoGames[] = []
        for (let i = 0; i < infos.length; i++) {
            data.push({
                info: infos[i],
                rounds: rounds[i],
                address: addresses[i]
            })
        }

        return data
    }
}

export { Game }
