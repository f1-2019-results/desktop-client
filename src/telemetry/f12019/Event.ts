import bParse from 'binaryParser';

export type EventData = ReturnType<(typeof parser)['parse']>;

const eventDetailsParser = bParse.object({
    vehicleId: bParse.uint8(),
    lapTime: bParse.float(),
});

const parser = bParse.object({
    eventStringCode: bParse.string().length(4),
    details: eventDetailsParser,
});

export function parse(buf: Buffer, offset = 0): EventData {
    return parser.parse(buf, offset);
}
