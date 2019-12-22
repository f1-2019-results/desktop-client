import bParse from 'binaryParser';

export type PacketHeader = ReturnType<(typeof parser)['parse']>;

const parser = bParse.object({
    packetFormat: bParse.uint16(),
    gameMajorVersion: bParse.uint8(),
    gameMinorVersion: bParse.uint8(),
    packetVersion: bParse.uint8(),
    packetId: bParse.uint8(),
    sessionUID: bParse.uint64(),
    sessionTime: bParse.float(),
    frameIdentifier: bParse.uint32(),
    playerCarIndex: bParse.uint8(),
});

export function parse(buf: Buffer, offset = 0): PacketHeader {
    return parser.parse(buf, offset);
}

export default {
    parse,
    size: parser.size,
};
