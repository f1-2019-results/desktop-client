import bParse from 'binaryParser';

export type SessionData = ReturnType<(typeof parser)['parse']>;

const marshalZoneParser = bParse.object({
    zoneStart: bParse.float(),
    zoneflag: bParse.int8(),
})

const parser = bParse.object({
    weather: bParse.uint8(),
    trackTemperature: bParse.uint8(),
    airTemperature: bParse.uint8(),
    totalLaps: bParse.uint8(),
    trackLength: bParse.uint16(),
    sessionType: bParse.uint8(),
    trackId: bParse.uint8(),
    carType: bParse.uint8(),
    sessionTimeLeft: bParse.uint16(),
    sessionDuration: bParse.uint16(),
    pitSpeedLimit: bParse.uint8(),
    gamePaused: bParse.boolean(),
    isSpectating: bParse.boolean(),
    spectatorCarIndex: bParse.uint8(),
    sliProNativeSupport: bParse.uint8(),
    numMarshalZones: bParse.uint8(),
    marshalZones: bParse.array(marshalZoneParser, 21),
    safetyCarStatus: bParse.uint8(),
    networkGame: bParse.boolean(),
});

export function parse(buf: Buffer, offset = 0): SessionData {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
