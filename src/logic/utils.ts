import { BigNumberish, formatUnits } from 'ethers'

export function delay (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function addStr (addr: string | undefined): string {
    if (!addr || addr.length < 64) return ''
    return addr.replace(addr.slice(5, 62), '...')
}

export function weiToEth (nanoAmount: bigint | string | BigNumberish, decimals: number): string {
    // console.log(nanoAmount)
    const amount = formatUnits(nanoAmount, decimals)
    let stringAmount = Number(amount).toPrecision(2)

    if (Number(stringAmount) === 0) {
        stringAmount = Number(amount).toPrecision(3)
    }
    if (Number(stringAmount) === 0) {
        stringAmount = Number(amount).toPrecision(4)
    }
    if (Number(stringAmount) === 0) {
        stringAmount = Number(amount).toPrecision(5)
    }

    if (Number(stringAmount) === 0) {
        stringAmount = Number(amount).toFixed(1)
    }
    return stringAmount
}

export function toH (totalSeconds: number): string {
    const totalMinutes = Math.floor(totalSeconds / 60)

    const seconds = totalSeconds % 60
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return (`${hours}:${minutes}:${seconds}`)
}
