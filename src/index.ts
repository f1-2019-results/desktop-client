import * as dgram from 'dgram';
import * as fs from 'fs';
const port = 20777;

async function init(): Promise<void> {
    const socket = dgram.createSocket('udp4');
    const writeStream = fs.createWriteStream('./dump.bin');

    socket.on('message', (buf) => {
        const header = parseHeader(buf);
        if (header.packetId === 3) {
            writeStream.write(buf);
        }
        if ([1, 2, 3, 4].includes(header.packetId)) {
            writeStream.write(buf);
        }
    });

    socket.on('listening', () => {
        console.log('Listening to socket');
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
