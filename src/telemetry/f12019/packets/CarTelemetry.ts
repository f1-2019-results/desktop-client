import bParse from 'binaryParser';

export type CarTelemetryData = ReturnType<(typeof parser)['parse']>;

const carTelemetryParser = bParse.object({
    speed: bParse.uint16(),
    throttle: bParse.float(),
    steer: bParse.float(),
    brake: bParse.float(),
    clutch: bParse.uint8(),
    gear: bParse.int8(),
    engineRPM: bParse.uint16(),
    drs: bParse.boolean(),
    revLightsPercent: bParse.uint8(),
    brakesTemperature: bParse.array(bParse.uint16(), 4),
    tyresSurfaceTemperature: bParse.array(bParse.uint16(), 4),
    tyresInnerTemperature: bParse.array(bParse.uint16(), 4),
    engineTemperature: bParse.uint16(),
    tyresPressure: bParse.array(bParse.float(), 4),
    surfaceType: bParse.array(bParse.uint8(), 4),
});

const parser = bParse.object({
    carTelemetry: bParse.array(carTelemetryParser, 20),
    buttonStatus: bParse.uint32(),
});

export function parse(buf: Buffer, offset = 0): CarTelemetryData {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
