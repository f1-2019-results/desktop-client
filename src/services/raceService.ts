import got from 'got'
import { apiUrl } from '../index'

export async function createRace(race: NewRaceBody): Promise<string> {
    const { body } = await got.post(apiUrl + '/race', {
        json: race,
        responseType: 'json',
    })
    return (body as any).uid as string
}

export interface Race {
    startTime: string
    trackId: string
    game: string,
    results: Array<{
        driverId: string
        teamId: number
        driverName: string
        isAi: boolean
        dnf: boolean
        startPosition: number
        position: number
        points: number
        laps: Array<{
            sectors: Array<number>
            position: number
            invalid: boolean
            pit: boolean
        }>
    }>
    uid: string
}

export type NewRaceBody = Omit<Race, 'uid'>