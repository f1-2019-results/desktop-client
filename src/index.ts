import * as dgram from 'dgram';
import * as fs from 'fs';
const port = 20777;

const HEADER_SIZE = 24;

async function init(): Promise<void> {
    const socket = dgram.createSocket('udp4');
    const writeStream = fs.createWriteStream('./dump.bin');

    let raceStarted = false;

    socket.on('message', (buf) => {
        const header = parseHeader(buf);
        if (header.packetId === 3) {
            const event = buf.toString('utf8', HEADER_SIZE - 1, HEADER_SIZE + 3);
            if (event === 'SSTA') {
                console.log('Race started');
                raceStarted = true;
            } else if (event === 'SEND') {
                console.log('Race ended');
                raceStarted = false;
                writeStream.on('close', () => {
                    process.exit(0);
                });
                writeStream.close();
            }
        }
        if ([1, 2, 3, 4].includes(header.packetId)) {
            if (raceStarted)
                writeStream.write(buf);
        }
    });

    socket.on('listening', () => {
        console.log('Waiting for race start');
    });

    socket.bind(port)
}

function parseHeader(buf: Buffer) {
    return {
        packetId: buf.readUInt8(5)
    }
}

init()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
