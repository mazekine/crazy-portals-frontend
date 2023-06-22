export class StorageGame {
    private _data: globalThis.Storage

    constructor () {
        this._data = window.localStorage
    }

    public save (key: string, data: any | string): boolean {
        try {
            this._data.setItem(`crazy-${key}`, data)
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }

    public get (key: string): any | undefined {
        try {
            return this._data.getItem(`crazy-${key}`)
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public del (key: string): boolean {
        try {
            this._data.removeItem(`crazy-${key}`)
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }
}
