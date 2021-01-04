
export function addRace(race: NewRaceBody): Promise<number> {
    // TODO:
    return Promise.resolve(0)
}

export interface Race {
    startTime: string
    trackId: string
    game: string,
    results: Array<{
        driverId: string
        driverName: string
        isAi: boolean
        startPosition: number
        position: number
        points: number
        laps: Array<{
            sectors: Array<number>
            position: number
            invalid: boolean
        }>
    }>
    uid: string
}

export type NewRaceBody = Omit<Race, 'uid'>