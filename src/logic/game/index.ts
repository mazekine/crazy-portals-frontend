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

        for (let i = 0; i < size; i++) {
            let arrX: ObjPixel[] = []
            for (let i2 = 0; i2 < size; i2++) {
                arrX.push({
                    number: Max - i2 - (i * 10),
                    type: 'default'
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
