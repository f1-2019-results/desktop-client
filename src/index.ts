import * as dgram from 'dgram';
import * as fs from 'fs';
import * as util from 'util';
import { parseHeader } from './parseDump';
const readFile = util.promisify(fs.readFile);

const port = 20777;

const HEADER_SIZE = 23;

async function init(): Promise<void> {
    const socket = dgram.createSocket('udp4');
    const writeStream = fs.createWriteStream('./dump.bin');

    let raceStarted = false;

    socket.on('message', (buf) => {
        const header = parseHeader(buf, 0);
        if (header.packetId === 3) {
            const event = buf.toString('utf8', HEADER_SIZE, HEADER_SIZE + 4);
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

async function processDump(s: string) {
    const buf = await readFile(s);
    let offset = 0;
    const result = {
        lapData: []
    };
    while (offset < buf.length) {
        const header = parseHeader(buf, offset);

    }
    fs.writeFileSync('./dump.json', JSON.stringify(result));
}

init()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
