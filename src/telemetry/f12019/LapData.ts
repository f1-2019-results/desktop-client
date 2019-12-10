export default interface LapData {
    lastLapTime: number;
    currentLapTime: number;
    sector1: number;
    sector2: number;
    position: number;
    lapNum: number;
    currentSector: number;
    lapInvalid: boolean;
}