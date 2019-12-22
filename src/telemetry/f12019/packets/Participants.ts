import bParse from 'binaryParser';

export type ParticipantsData = ReturnType<(typeof parser)['parse']>;

const participantData = bParse.object({
    aiControlled: bParse.boolean(),
    driverId: bParse.uint8(),
    teamId: bParse.uint8(),
    raceNumber: bParse.uint8(),
    nationality: bParse.uint8(),
    name: bParse.string().length(48),
    publicTelemetry: bParse.boolean(),
});

const parser = bParse.object({
    numActiveCars: bParse.uint8(),
    participants: bParse.array(participantData, 20),
});

export function parse(buf: Buffer, offset = 0): ParticipantsData {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
