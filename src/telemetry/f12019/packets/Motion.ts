import bParse from 'binaryParser';

export type MotionData = ReturnType<(typeof parser)['parse']>;

const carMotionDataParser = bParse.object({
    woldPositionX: bParse.float(),
    woldPositionY: bParse.float(),
    woldPositionZ: bParse.float(),
    woldVelocityX: bParse.float(),
    woldVelocityY: bParse.float(),
    woldVelocityZ: bParse.float(),
    worldForwardDirX: bParse.int16(),
    worldForwardDirY: bParse.int16(),
    worldForwardDirZ: bParse.int16(),
    worldRightDirX: bParse.int16(),
    worldRightDirY: bParse.int16(),
    worldRightDirZ: bParse.int16(),
    gForceLateral: bParse.float(),
    gForceLongitudinal: bParse.float(),
    gForceVertical: bParse.float(),
    yaw: bParse.float(),
    pitch: bParse.float(),
    roll: bParse.float(),
});

const parser = bParse.object({
    carMotionData: bParse.array(carMotionDataParser, 20),
    suspensionPosition: bParse.array(bParse.float(), 4),
    suspensionVelocity: bParse.array(bParse.float(), 4),
    suspensionAcceleration: bParse.array(bParse.float(), 4),
    wheelSpeed: bParse.array(bParse.float(), 4),
    wheelSlip: bParse.array(bParse.float(), 4),
    localVelocityX: bParse.float(),
    localVelocityY: bParse.float(),
    localVelocityZ: bParse.float(),
    angularVelocityX: bParse.float(),
    angularVelocityY: bParse.float(),
    angularVelocityZ: bParse.float(),
    angularAccelerationyX: bParse.float(),
    angularAccelerationyY: bParse.float(),
    angularAccelerationyZ: bParse.float(),
    frontWheelsAngle: bParse.float(),
});

export function parse(buf: Buffer, offset = 0): MotionData {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
