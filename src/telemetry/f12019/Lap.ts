import bParse from 'binaryParser';

export type LapData = ReturnType<(typeof parser)['parse']>;

const lapDataParser = bParse.object({
    lastLapTime: bParse.float(),
    currentLapTime: bParse.float(),
    bestLapTime: bParse.float(),
    sector1Time: bParse.float(),
    sector2Time: bParse.float(),
    lapDistance: bParse.float(),
    totalDistance: bParse.float(),
    safetyCarDelta: bParse.float(),
    carPosition: bParse.uint8(),
    currentLapNum: bParse.uint8(),
    pitStatus: bParse.uint8(),
    sector: bParse.uint8(),
    currentLapInvalid: bParse.boolean(),
    penalties: bParse.uint8(),
    gridPosition: bParse.uint8(),
    driverStatus: bParse.uint8(),
    resultStatus: bParse.uint8(),
});

const parser = bParse.object({
    lapData: bParse.array(lapDataParser, 20),
});

export function parse(buf: Buffer, offset = 0): LapData {
    return parser.parse(buf, offset);
}
