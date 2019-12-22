import bParse from 'binaryParser';

export type CarStatusData = ReturnType<(typeof parser)['parse']>;

const carStatusParser = bParse.object({
    tractionControl: bParse.uint8(),
    antiLockBrakes: bParse.uint8(),
    fuelMix: bParse.uint8(),
    frontBrakeBias: bParse.uint8(),
    pitLimiterStatus: bParse.boolean(),
    fuelInTank: bParse.float(),
    fuelCapacity: bParse.float(),
    fuelRemainingLaps: bParse.float(),
    maxRPM: bParse.uint16(),
    idleRPM: bParse.uint16(),
    maxGears: bParse.uint8(),
    drsAllowed: bParse.uint8(),
    tyresWear: bParse.array(bParse.uint8(), 4),
    actualTyreCompound: bParse.uint8(),
    tyreVisualCompound: bParse.uint8(),
    damage: bParse.object({
        tyres: bParse.array(bParse.uint8(), 4),
        frontWing: bParse.object({
            left: bParse.uint8(),
            right: bParse.uint8(),
        }),
        rearWing: bParse.uint8(),
        engine: bParse.uint8(),
        gearBox: bParse.uint8(),
    }),
    vehicleFiaFlags: bParse.int8(),
    ers: bParse.object({
        stored: bParse.float(),
        deployMode: bParse.uint8(),
        harvestedThisLapMGUK: bParse.float(),
        harvestedThisLapMGUH: bParse.float(),
        deployedThisLap: bParse.float(),
    })
});

const parser = bParse.array(carStatusParser, 20);

export function parse(buf: Buffer, offset = 0): CarStatusData {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
