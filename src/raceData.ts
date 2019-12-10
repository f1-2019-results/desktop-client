export interface RaceData {
    lapData: Array<{
        lap: number;
        timings: Array<{
            driverId: number;
            sector1?: number;
            sector2?: number;
            lapTime?: number;
            position?: number;
            invalidLap: boolean;
        }>;
    }>;
    participants: Array<{
        aiControlled: boolean;
        driverId: number;
        teamId: number;
        name: string;
    }>;
}
