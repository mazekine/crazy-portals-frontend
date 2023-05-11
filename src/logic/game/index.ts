/* eslint-disable @typescript-eslint/naming-convention */
interface ParamConstruct {
    address: string,
    addressUser: string
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

const portals: Portal[] = [
    {
        id: 1,
        type: 'blue',
        portals: [
            { number: 6, position: [] },
            { number: 45, position: [] }
        ]
    },
    {
        id: 2,
        type: 'blue',
        portals: [
            { number: 12, position: [] },
            { number: 43, position: [] }
        ]
    },
    {
        id: 3,
        type: 'red',
        portals: [
            { number: 7, position: [] },
            { number: 29, position: [] }
        ]
    },
    {
        id: 4,
        type: 'red',
        portals: [
            { number: 35, position: [] },
            { number: 81, position: [] }
        ]
    }
]

class Game {
    private _address: string

    private _addressUser: string

    constructor (params: ParamConstruct) {
        this._address = params.address
        this._addressUser = params.addressUser
    }

    public genArrBoard (size: number): [ObjPixel[][], Portal[]] {
        const fullArr: ObjPixel[][] = []

        const Max = size * size

        const sizePixel = 44

        const fixPixel = 1

        const localPortals = portals

        for (let i = 0; i < size; i++) {
            let arrX: ObjPixel[] = []
            for (let i2 = 0; i2 < size; i2++) {
                const num =  Max - i2 - (i * 10)

                const typePortal = portals.filter(
                    p => p.portals[0].number === num || p.portals[1].number === num
                )

                const type = typePortal.length > 0 ? 'portal-' + typePortal[0].type : 'default'

                if (type !== 'default') {
                    const indexPortal = portals.findIndex(
                        p => p.portals[0].number === num || p.portals[1].number === num
                    )

                    const numOfPortal = typePortal[0].portals[0].number === num ? 0 : 1

                    console.log((i % 2 ? 10 - i2 : i2 + 1) - 1, (10 - i) - 1, localPortals[indexPortal])
                    localPortals[indexPortal].portals[numOfPortal].position = [ (i % 2 ? 10 - i2 : i2 + 1) - 1, (10 - i) - 1 ] // x y
                }

                arrX.push({
                    number: Max - i2 - (i * 10),
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
                const aX = localPortals[i].portals[0].position[0] * sizePixel - (sizePixel / 2)
                const aY = localPortals[i].portals[0].position[1] * sizePixel + (sizePixel / 2)

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
}

export { Game }
