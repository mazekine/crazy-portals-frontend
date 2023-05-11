/* eslint-disable @typescript-eslint/naming-convention */
interface ParamConstruct {
    address: string,
    addressUser: string
}

export interface ObjPixel {
    number: number,
    type: 'default' | 'portal-blue' | 'portal-red' | 'win'
}

class Game {
    private _address: string

    private _addressUser: string

    constructor (params: ParamConstruct) {
        this._address = params.address
        this._addressUser = params.addressUser
    }

    public genArrBoard (size: number): ObjPixel[][] {
        const fullArr: ObjPixel[][] = []

        const Max = size * size

        const portal_blue: any[][] = [ [ 5, 17 ], [ 9, 43 ] ]

        const portal_red: any[][] = [ [ 7, 21 ], [ 54, 81 ], [ 34, 73 ] ]

        for (let i = 0; i < size; i++) {
            let arrX: ObjPixel[] = []
            for (let i2 = 0; i2 < size; i2++) {
                const num =  Max - i2 - (i * 10)

                let type = portal_blue.findIndex(p => p[0] === num || p[1] === num) >= 0 ? 'portal-blue' : 'default'
                if (type === 'default') type = portal_red.findIndex(p => p[0] === num || p[1] === num) >= 0 ? 'portal-red' : 'default'
                type = num === 100 ? 'win' : type

                arrX.push({
                    number: Max - i2 - (i * 10),
                    type: type as ObjPixel['type']
                })
            }

            if (i % 2) {
                arrX = arrX.reverse()
            }

            fullArr.push(arrX)
        }

        return fullArr
    }
}

export { Game }
