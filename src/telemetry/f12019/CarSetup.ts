import bParse from 'binaryParser';

export type CarSetupPacket = ReturnType<(typeof parser)['parse']>;

const carSetupDataparser = bParse.object({
    frontWing: bParse.uint8(),
    rearWing: bParse.uint8(),
    onThrottle: bParse.uint8(),
    offThrottle: bParse.uint8(),
    frontCamber: bParse.float(),
    rearCamber: bParse.float(),
    frontToe: bParse.float(),
    rearToe: bParse.float(),
    frontSuspension: bParse.uint8(),
    rearSuspension: bParse.uint8(),
    frontAntiRollbar: bParse.uint8(),
    rearAntiRollbar: bParse.uint8(),
    frontSuspensionHeight: bParse.uint8(),
    rearSuspensionHeight: bParse.uint8(),
    brakePressure: bParse.uint8(),
    brakeBias: bParse.uint8(),
    frontTyrePressure: bParse.float(),
    rearTyrePressure: bParse.float(),
    ballast: bParse.uint8(),
    fuelLoad: bParse.float(),
});

const parser = bParse.object({
    carSetups: bParse.array(carSetupDataparser, 20),
});

export function parse(buf: Buffer, offset = 0): CarSetupPacket {
    return parser.parse(buf, offset);
}
